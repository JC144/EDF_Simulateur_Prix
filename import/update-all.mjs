#!/usr/bin/env node
// Mise à jour globale : lance les quatre scripts d'import du dossier
// (calendriers Tempo/EJP, calendrier Zenflex, prix spot EPEX FR, grilles
// tarifaires PDF) en sous-processus, bufferise leur sortie (affichée à la
// complétion de chaque script) et termine par une synthèse, puis régénère
// les pages du site dérivées des tarifs (npm run gen ; vérification seule en
// --dry-run / --check-only).
//   node update-all.mjs [--dry-run] [--full] [--force] [--check-only]
//                       [--only tempo,zenflex,spot,tarifs] [--sequential]
//                       [--goldens] [--help]
//
// Pour un ciblage fin (--from/--to, --option TEMPO|EJP, --provider, --tarif),
// lancer le script individuel. Code de sortie : 0 si tout OK, 1 sinon.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { REPO_ROOT } from './lib/tarif-defs.mjs';
import { reportChanges } from './lib/site-gen.mjs';
import { run as runTarifsSection } from './tools/gen-tarifs-section.mjs';
import { run as runTarifPages } from './tools/gen-tarif-pages.mjs';

const IMPORT_DIR = path.dirname(fileURLToPath(import.meta.url));

// Ordre fixe = ordre de la synthèse. buildArgs traduit les options de
// l'orchestrateur vers les flags propres à chaque script.
const SCRIPTS = [
    { id: 'tempo', label: 'Calendriers Tempo/EJP', script: 'tempo-update.mjs', buildArgs: calendarArgs },
    { id: 'zenflex', label: 'Calendrier Zenflex', script: 'zenflex-update.mjs', buildArgs: calendarArgs },
    { id: 'spot', label: 'Prix spot EPEX FR', script: 'spot-update.mjs', buildArgs: calendarArgs },
    { id: 'tarifs', label: 'Grilles tarifaires PDF', script: 'update.mjs', buildArgs: tarifsArgs },
];

// Lignes remontées dans la synthèse (le détail complet reste dans le bloc de
// sortie de chaque script). Les libellés entre crochets viennent de
// lib/report.mjs ; NON GERE (HTML) est volontairement exclu (imprimé à
// chaque run pour les URLs HTML, vérification manuelle déjà connue).
const WARNING_PATTERNS = [
    /^ATTENTION : .*index\.html/, // spot-update : nouvelle année à brancher dans index.html
    /^\[(INTERVENTION MANUELLE REQUISE|PARSER MANQUANT|ERREUR RESEAU|ERREUR PARSING|VALEUR INTROUVABLE \(patch refuse\)|OFFRE INTROUVABLE)\]/,
];

main().catch(error => {
    console.error(`Erreur : ${error.message}`);
    process.exitCode = 1;
});

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
        printUsage();
        return;
    }
    const selected = SCRIPTS.filter(s => !opts.only || opts.only.has(s.id));
    const modes = [
        opts.dryRun && '--dry-run', opts.checkOnly && '--check-only',
        opts.full && '--full', opts.force && '--force',
    ].filter(Boolean);
    console.log(`Lancement de ${selected.length} script(s) ${opts.sequential ? 'en séquence' : 'en parallèle'} : `
        + selected.map(s => s.id).join(', ') + (modes.length > 0 ? ` (${modes.join(' ')})` : ''));

    let results;
    if (opts.sequential) {
        results = [];
        for (const entry of selected) {
            const result = await runScript(entry, entry.buildArgs(opts));
            flushBlock(result);
            results.push(result);
        }
    } else {
        // Node est mono-thread : les flushs à la complétion ne s'entrelacent pas.
        results = await Promise.all(selected.map(entry =>
            runScript(entry, entry.buildArgs(opts)).then(result => {
                flushBlock(result);
                return result;
            })));
    }

    printSummary(results);

    const allOk = results.every(r => r.code === 0);
    const goldensNeeded = results.some(r => r.goldensNeeded);
    // Pages du site : régénérées à chaque run, même si un script a échoué (un
    // échec n'écrit rien ; les autres scripts ont pu mettre à jour des
    // tarifs) ou si rien n'a changé (rattrape une modification manuelle d'un
    // tarif). En --dry-run / --check-only : simple vérification, rien n'est écrit.
    runSiteGenerators({ check: opts.dryRun || opts.checkOnly });
    if (goldensNeeded && !opts.dryRun && !opts.checkOnly) {
        console.log('\nFichiers modifiés — à vérifier avant commit :');
        console.log('  git diff scripts/tarifs scripts/tarifs-lib');
        console.log('  git diff index.html tarifs sitemap.xml   (pages de grille et section « Tarifs suivis »)');
        console.log('  UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"   (depuis la racine)');
        console.log('  git diff tests/golden');
    }
    if (opts.goldens) {
        if (!allOk) {
            console.log('\n--goldens : au moins un script a échoué, régénération non lancée.');
        } else if (!goldensNeeded) {
            console.log('\n--goldens : aucun fichier modifié, régénération inutile.');
        } else {
            await runGoldens();
        }
    }
    if (!allOk) process.exitCode = 1;
}

function parseArgs(argv) {
    const args = {
        dryRun: false, full: false, force: false, checkOnly: false,
        only: null, sequential: false, goldens: false, help: false,
    };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--dry-run') args.dryRun = true;
        else if (arg === '--full') args.full = true;
        else if (arg === '--force') args.force = true;
        else if (arg === '--check-only') args.checkOnly = true;
        else if (arg === '--sequential') args.sequential = true;
        else if (arg === '--goldens') args.goldens = true;
        else if (arg === '--help') args.help = true;
        else if (arg === '--only') {
            const ids = (argv[++i] ?? '').split(',').map(s => s.trim()).filter(Boolean);
            const known = new Set(SCRIPTS.map(s => s.id));
            if (ids.length === 0 || ids.some(id => !known.has(id))) {
                throw new Error(`--only : liste attendue parmi ${[...known].join(', ')}`);
            }
            args.only = new Set(ids);
        } else {
            throw new Error(`argument inconnu "${arg}" (--dry-run, --full, --force, --check-only, --only, --sequential, --goldens, --help)`);
        }
    }
    if (args.goldens && (args.dryRun || args.checkOnly)) {
        throw new Error("--goldens est incompatible avec --dry-run / --check-only (rien n'est écrit)");
    }
    return args;
}

function calendarArgs(opts) {
    const args = [];
    // --check-only n'existe pas sur ces scripts : --dry-run est leur mode
    // « ne touche à rien » équivalent.
    if (opts.dryRun || opts.checkOnly) args.push('--dry-run');
    if (opts.full) args.push('--full');
    return args;
}

function tarifsArgs(opts) {
    const args = [];
    if (opts.dryRun) args.push('--dry-run');
    if (opts.checkOnly) args.push('--check-only');
    if (opts.force) args.push('--force');
    return args;
}

// Lance un script en sous-processus, sortie (stdout+stderr) bufferisée dans
// l'ordre d'arrivée. Ne rejette jamais : un échec de lancement donne code -1.
function runScript(entry, cliArgs) {
    const start = Date.now();
    return new Promise(resolve => {
        const chunks = [];
        let settled = false;
        const done = code => {
            if (settled) return;
            settled = true;
            const output = chunks.join('');
            resolve({ entry, code, durationMs: Date.now() - start, output, ...analyzeOutput(output) });
        };
        const child = spawn(process.execPath, [path.join(IMPORT_DIR, entry.script), ...cliArgs], {
            cwd: IMPORT_DIR,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        for (const stream of [child.stdout, child.stderr]) {
            stream.setEncoding('utf8');
            stream.on('data', chunk => chunks.push(chunk));
        }
        child.on('error', error => {
            chunks.push(`Erreur de lancement : ${error.message}\n`);
            done(-1);
        });
        child.on('close', code => done(code ?? -1));
    });
}

function analyzeOutput(output) {
    const warnings = [];
    for (const line of output.split('\n')) {
        if (WARNING_PATTERNS.some(re => re.test(line))) warnings.push(line.trim());
    }
    return { warnings, goldensNeeded: output.includes('UPDATE_GOLDEN') };
}

function flushBlock(result) {
    const status = result.code === 0 ? 'OK' : `ÉCHEC (code ${result.code})`;
    console.log(`\n=== ${result.entry.label} — ${status} (${formatDuration(result.durationMs)}) ===`);
    if (result.output.length > 0) {
        process.stdout.write(result.output.endsWith('\n') ? result.output : `${result.output}\n`);
    }
}

function printSummary(results) {
    const ordered = SCRIPTS.map(s => results.find(r => r.entry.id === s.id)).filter(Boolean);
    console.log('\n--- Synthèse ---');
    const header = ['Script', 'Statut', 'Durée', 'Remarques'];
    const rows = ordered.map(r => [
        r.entry.label,
        r.code === 0 ? 'OK' : 'ÉCHEC',
        formatDuration(r.durationMs),
        r.code !== 0 ? `code ${r.code}`
            : r.warnings.length > 0 ? `${r.warnings.length} avertissement(s)` : '—',
    ]);
    const widths = header.map((h, i) => Math.max(h.length, ...rows.map(row => row[i].length)));
    for (const row of [header, ...rows]) {
        console.log(row.map((cell, i) => cell.padEnd(widths[i])).join('  ').trimEnd());
    }
    for (const r of ordered) {
        for (const warning of r.warnings) {
            console.log(`  [${r.entry.id}] ${warning}`);
        }
    }
}

// Pages statiques dérivées des tarifs (section « Tarifs suivis » d'index.html,
// pages tarifs/*.html, sitemap.xml) : déterministes, équivalent de
// npm run gen (check = npm run gen:check, informatif : n'échoue pas le run).
function runSiteGenerators({ check }) {
    console.log(check
        ? '\nVérification des pages du site (npm run gen:check) ...'
        : '\nRégénération des pages du site (npm run gen) ...');
    try {
        reportChanges(runTarifsSection({ check }).changes, { check, what: 'Section « Tarifs suivis » d’index.html' });
        const pages = runTarifPages({ check });
        for (const w of new Set(pages.warnings)) console.warn(`Attention : ${w}`);
        reportChanges(pages.changes, { check, what: 'Pages de grille tarifaire (tarifs/*.html, sitemap.xml)' });
    } catch (error) {
        console.error(`Échec de la régénération des pages : ${error.message}`);
        process.exitCode = 1;
    }
}

// Régénère les goldens depuis la racine (le glob est résolu par node --test).
function runGoldens() {
    console.log('\nRégénération des goldens : UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs" ...');
    return new Promise(resolve => {
        const child = spawn(process.execPath, ['--test', 'tests/**/*.test.mjs'], {
            cwd: REPO_ROOT,
            env: { ...process.env, UPDATE_GOLDEN: '1' },
            stdio: 'inherit',
        });
        child.on('close', code => {
            if (code !== 0) {
                console.error(`Échec de la régénération des goldens (code ${code}).`);
                process.exitCode = 1;
            } else {
                console.log('Goldens régénérés — relire git diff tests/golden avant commit.');
            }
            resolve();
        });
    });
}

function formatDuration(ms) {
    return `${(ms / 1000).toFixed(1).replace('.', ',')} s`;
}

function printUsage() {
    console.log(`Usage : node update-all.mjs [options]

Lance les scripts de mise à jour du dossier import/ (calendriers Tempo/EJP,
calendrier Zenflex, prix spot EPEX FR, grilles tarifaires PDF), bufferise
leur sortie et affiche une synthèse finale.

Options :
  --dry-run       forwardé à tous : tout le pipeline sauf l'écriture
  --full          forwardé à tempo/zenflex/spot : ré-import complet de l'historique
  --force         forwardé à tarifs (update.mjs) : re-parse même si SHA-256 inchangé
  --check-only    tarifs en --check-only, les trois autres en --dry-run (rien n'est écrit)
  --only a,b      limite aux scripts listés : ${SCRIPTS.map(s => s.id).join(', ')}
  --sequential    lance les scripts l'un après l'autre (défaut : parallèle)
  --goldens       si tout est OK et que des fichiers ont changé, régénère les goldens
                  (incompatible avec --dry-run / --check-only)
  --help          affiche cette aide

À chaque run, les pages du site dérivées des tarifs (section « Tarifs suivis »
d'index.html, pages tarifs/*.html, sitemap.xml) sont ensuite régénérées
(équivalent de npm run gen) ; en --dry-run / --check-only elles sont seulement
vérifiées.

Pour un ciblage fin (--from/--to, --option TEMPO|EJP, --provider, --tarif),
lancer le script individuel. Code de sortie : 0 si tout OK, 1 sinon.`);
}
