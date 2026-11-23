#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT, listAppScripts, listTarifDefs } from './lib/tarif-defs.mjs';
import { removeTarifBlocks } from './lib/patch-tarif.mjs';
import { loadDefsFromSource, revalidateTarifs } from './lib/revalidate.mjs';
import { RemovalPlan } from './lib/removal-plan.mjs';
import { loadManifest } from './lib/manifest.mjs';
import { providerFor } from './lib/registry.mjs';
import { fixtureSlug } from './lib/fixtures.mjs';
import { cacheBasename } from './lib/download.mjs';
import { generateCatalogue, renderIndex } from './tools/gen-tarifs-section.mjs';
import { GENERATED_MARK, renderSitemap } from './tools/gen-tarif-pages.mjs';
import { tarifSlug } from '../scripts/utils/tarifMeta.js';

const usage = `node import/remove.mjs (--tarif "Nom exact ou slug" | --provider dossier) [--dry-run | --apply]
Affiche les offres et fichiers concernés. --apply applique la suppression.`;

const providerOf = def => def.file.split('/')[2];
const absolute = file => path.join(REPO_ROOT, file);
const json = value => JSON.stringify(value, null, 2) + '\n';
function filesIn(dir) {
    return fs.existsSync(absolute(dir)) ? fs.readdirSync(absolute(dir), { withFileTypes: true })
        .filter(entry => entry.isFile()).map(entry => entry.name) : [];
}

function dataSources(defs) {
    const sources = new Set();
    for (const def of defs) {
        const rule = def.dayRule;
        for (const cal of [rule.calendar, rule.calendarOverride?.calendar, rule.peakCalendar].filter(Boolean)) {
            sources.add('calendar/' + cal);
        }
        const source = def.marketIndex?.source ?? (rule.type === 'spot' ? rule.source : null);
        if (source) sources.add('spot/' + source);
    }
    return sources;
}

function planScripts(plan, removed, kept) {
    const removedData = dataSources(removed);
    const keptData = dataSources(kept);
    const retiredFiles = new Set();
    for (const file of listAppScripts().filter(f => /^scripts\/tarifs-lib\/(calendars|spot)\//.test(f))) {
        const registered = [];
        const sandbox = {
            defineCalendar: id => registered.push('calendar/' + id),
            defineSpotPrices: id => registered.push('spot/' + id),
        };
        sandbox.window = sandbox;
        vm.runInNewContext(fs.readFileSync(absolute(file), 'utf8'), sandbox, { filename: file });
        if (registered.length && registered.every(id => removedData.has(id) && !keptData.has(id))) retiredFiles.add(file);
    }
    const overrides = [];
    for (const [file, defs] of Map.groupBy(removed, d => d.file)) {
        const siblings = kept.filter(d => d.file === file);
        if (!siblings.length) {
            retiredFiles.add(file);
            continue;
        }
        plan.edit(file, source => {
            const next = removeTarifBlocks(source, defs.map(d => d.name));
            if (JSON.stringify(loadDefsFromSource(next, file)) !== JSON.stringify(siblings)) {
                throw new Error('Les définitions restantes ont changé dans ' + file);
            }
            overrides.push({ file, newSource: next });
            return next;
        });
    }
    for (const file of retiredFiles) {
        plan.remove(file);
        overrides.push({ file, newSource: '' });
    }
    plan.edit('scripts/tarifs-manifest.js', source => {
        const next = source.split('\n').filter(line => {
            const entry = /^\s*"([^"]+)",?\s*$/.exec(line);
            return !entry || !retiredFiles.has(entry[1]);
        }).join('\n');
        for (const file of retiredFiles) {
            if (next.includes(JSON.stringify(file))) throw new Error('Entrée du manifeste non retirée : ' + file);
        }
        return next;
    });
    const validation = revalidateTarifs(overrides);
    if (!validation.ok) throw new Error(validation.error);
}

function planSite(plan, removed, kept) {
    const slugs = new Set(kept.map(d => tarifSlug(d.name)));
    for (const { name } of removed) {
        const slug = tarifSlug(name);
        if (!slug || slugs.has(slug)) throw new Error('Slug vide ou partagé : ' + name);
        const page = `tarifs/${slug}.html`;
        if (fs.existsSync(absolute(page))) {
            if (!fs.readFileSync(absolute(page), 'utf8').includes(GENERATED_MARK)) {
                throw new Error('Page de tarif éditée à la main : ' + page);
            }
            plan.remove(page);
        }
        plan.remove(`tarifs/historique/${slug}.json`);
        plan.remove(`tests/tarifs/${slug}.test.mjs`);
    }
    plan.edit('index.html', html => renderIndex(html, kept));
    plan.edit('scripts/tarifs-catalogue.js', () => generateCatalogue(kept));
    plan.edit('sitemap.xml', xml => renderSitemap(xml, kept.map(d => ({ slug: tarifSlug(d.name), lastUpdate: d.lastUpdate }))));
}

function planGoldens(plan, names) {
    for (const file of filesIn('tests/golden').filter(f => f.endsWith('.json'))) {
        plan.edit('tests/golden/' + file, source => {
            const data = JSON.parse(source);
            if (Array.isArray(data)) {
                const kept = data.filter(entry => !names.has(entry.name));
                return kept.length === data.length ? source : json(kept);
            }
            const keys = Object.keys(data).filter(key => names.has(key));
            for (const key of keys) delete data[key];
            return keys.length ? json(data) : source;
        });
    }
}

function planImport(plan, removed, kept, provider, lastOffer) {
    const manifest = loadManifest();
    const keptUrls = new Set(kept.map(d => d.price_url));
    const removedUrls = new Set(removed.map(d => d.price_url).filter(url => url && !keptUrls.has(url)));
    if (lastOffer) {
        for (const url of Object.keys(manifest)) {
            if (!keptUrls.has(url) && providerFor(url) === provider) removedUrls.add(url);
        }
        plan.remove(`import/parsers/${provider}.mjs`);
        plan.remove(`import/tests/${provider}.test.mjs`);
    }

    const fixtureDir = 'import/fixtures/' + provider;
    const removedStems = new Set([...removedUrls].map(fixtureSlug));
    const keptStems = new Set(kept.filter(d => providerOf(d) === provider && d.price_url).map(d => fixtureSlug(d.price_url)));
    const fixtures = filesIn(fixtureDir);
    const names = new Set(removed.map(d => d.name));
    for (const file of fixtures.filter(f => f.endsWith('.expected.json'))) {
        const stem = file.slice(0, -'.expected.json'.length);
        if (lastOffer) {
            removedStems.add(stem);
            continue;
        }
        plan.edit(fixtureDir + '/' + file, source => {
            const grid = JSON.parse(source);
            const offers = Object.keys(grid.offers);
            if (!offers.some(name => names.has(name))) return source;
            if (offers.every(name => names.has(name)) && !keptStems.has(stem)) {
                removedStems.add(stem);
                return source;
            }
            for (const name of names) delete grid.offers[name];
            return json(grid);
        });
    }
    for (const file of fixtures) {
        const match = /^(.+?)(?:\.expected\.json|\.json|\.txt)$/.exec(file);
        if (match && !keptStems.has(match[1]) && removedStems.has(match[1])) {
            plan.remove(fixtureDir + '/' + file);
        }
    }
    for (const url of Object.keys(manifest)) {
        const stem = fixtureSlug(url);
        if (providerFor(url) === provider && removedStems.has(stem) && !keptStems.has(stem)
            && !keptUrls.has(url)) removedUrls.add(url);
    }

    // Le cache utilise le nom de fichier de l'URL (deux hôtes peuvent publier grille.pdf).
    // Garder chaque basename encore référencé, y compris par une ancienne édition.
    const cacheKey = name => process.platform === 'win32' ? name.toLowerCase() : name;
    const keptBasenames = new Set([...keptUrls, ...Object.keys(manifest)]
        .filter(url => url && !removedUrls.has(url)).map(url => cacheKey(cacheBasename(url))));
    const removedBasenames = new Set([...removedUrls].map(url => cacheKey(cacheBasename(url))));
    for (const file of filesIn('import/cache')) {
        const basename = /^[a-f0-9]{8}-(.+)$/.exec(cacheKey(file))?.[1];
        if (removedBasenames.has(basename) && !keptBasenames.has(basename)) plan.remove('import/cache/' + file);
    }
    if ([...removedUrls].some(url => Object.hasOwn(manifest, url))) {
        plan.edit('import/manifest.json', source => {
            const current = JSON.parse(source);
            for (const url of removedUrls) delete current[url];
            return json(current);
        });
    }
}

export function planRemoval({ tarif, provider }) {
    if (Boolean(tarif) === Boolean(provider)) throw new Error('Préciser un seul --tarif ou --provider.');
    const defs = listTarifDefs();
    const removed = defs.filter(d => tarif ? d.name === tarif || tarifSlug(d.name) === tarif : providerOf(d) === provider);
    if (!removed.length) throw new Error('Cible introuvable : ' + (tarif ?? provider));
    if (tarif && removed.length !== 1) throw new Error('Tarif ambigu : ' + tarif);
    const names = new Set(removed.map(d => d.name));
    const kept = defs.filter(d => !removed.includes(d));
    const folder = providerOf(removed[0]);
    const lastOffer = !kept.some(d => providerOf(d) === folder);
    const plan = new RemovalPlan();
    planScripts(plan, removed, kept);
    planSite(plan, removed, kept);
    planGoldens(plan, names);
    planImport(plan, removed, kept, folder, lastOffer);
    return { names, plan, emptyDirs: lastOffer ? ['scripts/tarifs/' + folder, 'import/fixtures/' + folder] : [] };
}

function main() {
    const { values, tokens } = parseArgs({ tokens: true, options: {
        tarif: { type: 'string' }, provider: { type: 'string' }, apply: { type: 'boolean' },
        'dry-run': { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
    } });
    if (values.help) return console.log(usage);
    if (tokens.filter(t => ['tarif', 'provider'].includes(t.name)).length !== 1) throw new Error(usage);
    if (values.apply && values['dry-run']) throw new Error('--apply et --dry-run sont incompatibles.');
    const { names, plan, emptyDirs } = planRemoval(values);
    console.log(`${names.size} offre(s) à supprimer :\n  ${[...names].join('\n  ')}`);
    for (const [file, { after }] of plan.changes) console.log(after === null ? 'Supprimer' : 'Modifier ', file);
    if (!values.apply) return console.log('Aperçu. Ajouter --apply pour appliquer cette suppression.');
    plan.apply();
    for (const dir of emptyDirs) {
        if (fs.existsSync(absolute(dir)) && !fs.readdirSync(absolute(dir)).length) fs.rmdirSync(absolute(dir));
    }
    console.log(`Suppression appliquée (${plan.changes.size} fichiers).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try { main(); } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
