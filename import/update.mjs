#!/usr/bin/env node
// Outil local de mise à jour des grilles tarifaires.
// Pour chaque price_url unique des defineTarif du repo :
//   1. télécharge la grille (requête conditionnelle + comparaison SHA-256),
//   2. si elle a changé, extrait le texte du PDF et parse les prix,
//   3. patche les prix, lastUpdate et le lien des grilles à URL variable,
//   4. met à jour manifest.json.
// La revue humaine se fait ensuite sur `git diff scripts/tarifs` avant commit.
//
// Usage :
//   node update.mjs [--check-only] [--dry-run] [--force] [--offline]
//                   [--provider edf] [--tarif "EDF - Tempo"]
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual, parseArgs } from 'node:util';

import { listTarifDefs, groupByPriceUrl, REPO_ROOT } from './lib/tarif-defs.mjs';
import { loadManifest, saveManifest } from './lib/manifest.mjs';
import { fetchGrille, findInCache } from './lib/download.mjs';
import { resolveParser } from './lib/registry.mjs';
import { reconcileOffer } from './lib/reconcile.mjs';
import { extractPdf } from './lib/pdf-text.mjs';
import { patchTarifFile } from './lib/patch-tarif.mjs';
import { revalidateTarifs, loadDefsFromSource } from './lib/revalidate.mjs';
import { updateReadmeDates } from './lib/readme.mjs';
import { makeReport, printWithdrawals } from './lib/report.mjs';
import { catalogStatus, isSubscriptionDisabled, todayInParis } from './lib/subscriptions.mjs';

const { values: opts } = parseArgs({
    options: {
        'check-only': { type: 'boolean', default: false },
        'dry-run': { type: 'boolean', default: false },
        'force': { type: 'boolean', default: false },
        'offline': { type: 'boolean', default: false },
        'provider': { type: 'string' },
        'tarif': { type: 'string' },
    },
});

const today = new Date().toISOString().slice(0, 10);
const subscriptionDate = todayInParis();

function filterDefs(defs) {
    let filtered = defs;
    if (opts.provider) {
        filtered = filtered.filter(d => d.file.split('/')[2] === opts.provider);
    }
    if (opts.tarif) {
        filtered = filtered.filter(d => d.name === opts.tarif);
    }
    return filtered;
}

// Applique les changements de toutes les offres d'une URL, groupés par
// fichier (tout-ou-rien par fichier), puis revalide les fichiers patchés
// avec la vraie factory defineTarif avant d'écrire quoi que ce soit.
function applyChanges(perDefChanges, report) {
    const byFile = new Map();
    for (const { def, changes } of perDefChanges) {
        if (!byFile.has(def.file)) byFile.set(def.file, []);
        byFile.get(def.file).push({ name: def.name, changes });
    }

    const pending = []; // { file, absPath, newSource }
    for (const [file, tarifChanges] of byFile) {
        const absPath = path.join(REPO_ROOT, file);
        let source = fs.readFileSync(absPath, 'utf8');
        for (const { name, changes } of tarifChanges) {
            const result = patchTarifFile(source, name, changes);
            if (result.failed.length > 0) {
                const detail = result.failed.map(f => `${name}: ${f.path.join('.')} (${f.reason})`).join(', ');
                return { ok: false, status: 'patch-failed', detail };
            }
            source = result.source;
        }
        // Relecture du source patché : chaque valeur attendue doit s'y
        // retrouver exactement (garde-fou contre un patch mal ciblé).
        const reloaded = loadDefsFromSource(source, file);
        for (const { name, changes } of tarifChanges) {
            const def = reloaded.find(d => d.name === name);
            for (const c of changes) {
                const actual = c.path.reduce((o, k) => o?.[k], def);
                if (!isDeepStrictEqual(structuredClone(actual), c.new)) {
                    return { ok: false, status: 'patch-failed', detail: `${name}: ${c.path.join('.')} relu à ${actual} au lieu de ${c.new}` };
                }
            }
        }
        pending.push({ file, absPath, newSource: source });
    }

    const validation = revalidateTarifs(pending);
    if (!validation.ok) {
        return { ok: false, status: 'patch-failed', detail: `revalidation : ${validation.error}` };
    }

    for (const { file, absPath, newSource } of pending) {
        fs.writeFileSync(absPath, newSource);
        report.modifiedFiles.add(file);
    }
    return { ok: true, files: [...byFile.keys()] };
}

async function processUrl(url, urlDefs, manifest, report, appliedDates) {
    const offerNames = urlDefs.map(d => d.name);
    const names = offerNames.join(', ');
    const resolved = await resolveParser(url);
    if (!resolved) {
        report.add(url, 'unsupported', names);
        return;
    }

    if (resolved.parser?.checkInputs) {
        try { await resolved.parser.checkInputs(opts.offline, today); }
        catch (err) { report.add(url, 'manual', err.message); return; }
    }
    const configuredUrl = url;
    if (!opts.offline && resolved.parser?.discoverUrl) {
        try {
            url = await resolved.parser.discoverUrl(url);
        } catch (err) {
            if (err.code === 'GRID_NOT_LISTED') report.flagOffers(offerNames, err.page, 'Grille absente du catalogue du fournisseur');
            report.add(url, 'network-error', err.message);
            return;
        }
    }
    const sourceChanged = url !== configuredUrl;
    const entry = manifest[url] || {};
    const checkSubscriptions = !opts['check-only'] && resolved.parser?.subscriptionCheck?.(url);
    let pdfPath = null;
    let unchanged = null;
    let sha256 = null;
    let fetchedValidators = null; // { etag, lastModified } — persistés à la réconciliation

    if (opts.offline) {
        pdfPath = findInCache(url, entry.sha256);
        if (!pdfPath) {
            report.add(url, 'network-error', 'aucun PDF en cache (mode --offline)');
            return;
        }
    } else {
        // Requête conditionnelle UNIQUEMENT si la dernière grille vue a été
        // réconciliée : sinon un 304 masquerait une intervention manuelle
        // en attente.
        const conditional = entry.sha256 ? { etag: entry.etag, lastModified: entry.lastModified } : {};
        let result;
        try {
            const needCopy = checkSubscriptions && entry.sha256 && !findInCache(url, entry.sha256);
            result = await fetchGrille(url, { ...conditional, force: opts.force || sourceChanged || needCopy });
        } catch (err) {
            if (err.status === 404 || err.status === 410) {
                report.flagOffers(offerNames, url, `Grille introuvable (HTTP ${err.status})`);
            }
            report.add(url, 'network-error', err.message);
            return;
        }
        entry.lastChecked = today;
        manifest[url] = entry;

        if (result.status === 'not-modified') {
            if (!opts.force && !sourceChanged) unchanged = '304 Not Modified';
            pdfPath = findInCache(url, entry.sha256);
            if (!pdfPath && (!unchanged || checkSubscriptions)) {
                report.add(url, 'network-error', '304 mais aucun PDF en cache pour lire la grille');
                return;
            }
        } else {
            sha256 = result.sha256;
            fetchedValidators = { etag: result.etag, lastModified: result.lastModified };
            if (sha256 === entry.sha256 && !opts.force && !sourceChanged) {
                entry.etag = result.etag;
                entry.lastModified = result.lastModified;
                unchanged = 'SHA-256 inchangé';
            }
            pdfPath = result.cachePath;
        }
    }

    if (unchanged && !checkSubscriptions) {
        report.add(url, 'up-to-date', unchanged);
        return;
    }

    if (opts['check-only']) {
        report.add(url, 'modified', `grille changée (non appliquée, --check-only) — ${names}`);
        return;
    }

    if (!resolved.parser) {
        report.add(url, 'no-parser', `${resolved.provider} — ${names}`);
        return;
    }

    // Extraction + parsing
    let parsed;
    const rulesByName = new Map();
    const ruleChanges = new Map();
    try {
        const doc = await extractPdf(pdfPath);
        if (checkSubscriptions) {
            const rules = checkSubscriptions(doc).filter(rule => rule.names.length);
            // En aperçu ou en cas de réconciliation partielle, la fiche peut
            // encore référencer l'ancienne URL du catalogue fournisseur.
            for (const key of new Set([configuredUrl, url])) {
                const grid = manifest[key] ??= {};
                if (rules.length) grid.subscriptionRules = rules;
                else delete grid.subscriptionRules;
            }
            for (const { names, ...restriction } of rules) {
                const selected = names.filter(name => offerNames.includes(name));
                for (const name of selected) rulesByName.set(name, restriction);
                if (isSubscriptionDisabled(restriction, subscriptionDate)) report.flagOffers(selected, url, restriction.reason, restriction.kind);
            }
            for (const def of urlDefs) {
                const next = rulesByName.get(def.name);
                if (!isDeepStrictEqual(structuredClone(def.subscriptionRule), next)) {
                    ruleChanges.set(def.name, { path: ['subscriptionRule'], old: def.subscriptionRule, new: next });
                }
            }
        }
        if (unchanged && !ruleChanges.size) {
            report.add(url, 'up-to-date', unchanged);
            return;
        }
        if (!unchanged) parsed = resolved.parser.parse(doc, url);
    } catch (err) {
        report.add(url, 'parse-error', err.message);
        return;
    }

    const lastUpdate = parsed?.gridDate || today;
    const perDefChanges = [];
    const allIssues = [];
    const missing = parsed ? offerNames.filter(name => !Object.hasOwn(parsed.offers, name) && rulesByName.get(name)?.kind !== 'closed') : [];
    if (missing.length) {
        report.flagOffers(missing, url, 'Offre non retrouvée par le parseur dans cette grille');
        report.add(url, 'offer-missing', missing.join(', '));
        return;
    }
    for (const def of urlDefs) {
        const offer = parsed?.offers[def.name];
        let reconciled = { changes: [], issues: [] };
        try {
            // Une fermeture confirmée peut être publiée sans nouvelle grille de prix.
            if (offer) reconciled = reconcileOffer(def, offer, lastUpdate);
        } catch (err) {
            report.add(url, 'parse-error', `${def.name} : ${err.message}`);
            return;
        }
        if (reconciled.issues.length) {
            allIssues.push(...reconciled.issues.map(i => `${def.name} : ${i}`));
        }
        if (offer && def.price_url !== url) {
            reconciled.changes.push({ path: ['price_url'], old: def.price_url, new: url });
        }
        if (ruleChanges.has(def.name)) reconciled.changes.push(ruleChanges.get(def.name));
        if (reconciled.changes.length) {
            perDefChanges.push({ def, changes: reconciled.changes });
        }
    }

    if (allIssues.length) {
        report.add(url, 'manual', allIssues.join(' | '));
        return;
    }

    const totalChanges = perDefChanges.reduce((n, c) => n + c.changes.length, 0);
    if (totalChanges === 0) {
        // Grille changée mais valeurs identiques (ré-édition du PDF) : réconcilié.
        if (sha256) {
            entry.sha256 = sha256;
            Object.assign(entry, fetchedValidators);
            entry.lastApplied = entry.lastApplied || today;
        }
        report.add(url, 'no-change', names);
        return;
    }

    if (opts['dry-run']) {
        report.add(url, 'modified', `${totalChanges} valeur(s) — dry-run, rien n'est écrit`);
        for (const { def, changes } of perDefChanges) {
            for (const c of changes) {
                console.log(`    ${def.name} · ${c.path.join('.')} : ${JSON.stringify(c.old)} -> ${JSON.stringify(c.new)}`);
            }
        }
        return;
    }

    const applied = applyChanges(perDefChanges, report);
    if (!applied.ok) {
        report.add(url, applied.status, applied.detail);
        return;
    }
    if (sha256) {
        entry.sha256 = sha256;
        Object.assign(entry, fetchedValidators);
    }
    entry.lastApplied = today;
    const prevDate = appliedDates.get(resolved.provider);
    if (totalChanges > ruleChanges.size && (!prevDate || lastUpdate > prevDate)) appliedDates.set(resolved.provider, lastUpdate);
    report.add(url, 'modified', `${totalChanges} valeur(s) dans ${applied.files.join(', ')}`);
    for (const { def, changes } of perDefChanges) {
        for (const c of changes) {
            console.log(`    ${def.name} · ${c.path.join('.')} : ${JSON.stringify(c.old)} -> ${JSON.stringify(c.new)}`);
        }
    }
}

async function main() {
    const defs = filterDefs(listTarifDefs());
    if (defs.length === 0) {
        if (!opts.provider && !opts.tarif) {
            console.log('Le catalogue est vide. Aucune grille à mettre à jour.');
            return;
        }
        console.error('Aucun tarif ne correspond au filtre.');
        process.exit(2);
    }
    const byUrl = groupByPriceUrl(defs);
    const manifest = loadManifest();
    const report = makeReport();

    console.log(`${defs.length} tarif(s), ${byUrl.size} URL(s) de grille unique(s)\n`);
    const appliedDates = new Map();
    for (const [url, urlDefs] of byUrl) {
        await processUrl(url, urlDefs, manifest, report, appliedDates);
    }
    report.summary();

    // Un --tarif ne réconcilie pas les autres offres de la même pièce jointe.
    if (!opts['dry-run'] && !opts['check-only'] && !opts.offline && !opts.tarif) {
        saveManifest(manifest);
    }
    if (appliedDates.size > 0) {
        const updated = updateReadmeDates(appliedDates);
        if (updated.length) console.log(`\nREADME « Derniers tarifs » mis à jour : ${updated.join(', ')}`);
    }

    if (report.modifiedFiles.size > 0) {
        console.log('\nFichiers modifiés — à vérifier avant commit :');
        console.log('  git diff scripts/tarifs');
        console.log('  UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"   (depuis la racine)');
        console.log('  git diff tests/golden');
    }
    const findings = [...report.withdrawals.values()];
    if (process.send) process.send({ type: 'offer-withdrawals', findings, catalog: catalogStatus(opts['dry-run'] ? manifest : undefined) });
    else printWithdrawals(findings);
    process.exitCode = report.hasErrors() ? 1 : 0;
}

main();
