#!/usr/bin/env node
// Mise à jour manuelle des prix spot EPEX FR Day-Ahead depuis
// l'API energy-charts.info (données Bundesnetzagentur | SMARD.de, CC BY 4.0) :
//   node spot-update.mjs [--from AAAA-MM-JJ] [--to AAAA-MM-JJ] [--dry-run] [--full]
//
// Incrémental par défaut : repart du lendemain de la dernière date présente
// dans scripts/tarifs-lib/spot/epex-fr-*.js (ou du 2023-01-01 si vide/--full).
// Les fichiers d'années touchées sont régénérés entièrement (diff d'append
// propre, idempotent). Un jour incomplet côté API est omis : le simulateur le
// marquera « en erreur » pour les tarifs spot uniquement.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { REPO_ROOT } from './lib/tarif-defs.mjs';
import { buildDays, serializeYearFile, splitByYear } from './lib/spot-data.mjs';

const SOURCE_NAME = 'epex-fr';
const SPOT_DIR = path.join(REPO_ROOT, 'scripts', 'tarifs-lib', 'spot');
const DEFAULT_START = '2023-01-01';
const API_BASE = 'https://api.energy-charts.info/price?bzn=FR';
const FETCH_DELAY_MS = 2000;
const RETRY_DELAYS_MS = [5000, 15000, 45000]; // sur 429/5xx

main().catch(error => {
    console.error(`Erreur : ${error.message}`);
    process.exitCode = 1;
});

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const existingDays = args.full ? {} : loadExistingDays();
    const existingDates = Object.keys(existingDays).sort();

    const from = args.from
        ?? (existingDates.length > 0 ? nextDay(toIso(existingDates.at(-1))) : DEFAULT_START);
    // Day-ahead : les prix du lendemain sont connus la veille en fin de journée.
    const to = args.to ?? nextDay(todayParis());

    if (from > to) {
        console.log(`À jour : dernière date connue ${existingDates.at(-1)}, rien à récupérer.`);
        return;
    }
    console.log(`Récupération ${from} -> ${to} (${existingDates.length} jours déjà connus)`);

    const { unixSeconds, prices } = await fetchRange(from, to);
    const { days: newDays, skipped } = buildDays(unixSeconds, prices);
    // Ne garde que la fenêtre demandée : l'API peut déborder d'un jour.
    for (const date of Object.keys(newDays)) {
        const iso = toIso(date);
        if (iso < from || iso > to) delete newDays[date];
    }
    const skippedInRange = skipped.filter(d => toIso(d) >= from && toIso(d) <= to);
    if (skippedInRange.length > 0) {
        console.warn(`Jours incomplets omis (normal pour les derniers jours) : ${skippedInRange.join(', ')}`);
    }
    if (Object.keys(newDays).length === 0) {
        console.log('Aucun jour complet à ajouter.');
        return;
    }

    const merged = { ...existingDays, ...newDays };
    const byYear = splitByYear(merged);
    const written = [];
    for (const [year, daysOfYear] of [...byYear.entries()].sort()) {
        const file = path.join(SPOT_DIR, `${SOURCE_NAME}-${year}.js`);
        const content = serializeYearFile(SOURCE_NAME, year, daysOfYear);
        if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) continue;
        verifyGeneratedFile(content, file);
        if (!args.dryRun) {
            fs.mkdirSync(SPOT_DIR, { recursive: true });
            fs.writeFileSync(file, content);
        }
        written.push(file);
    }

    const label = args.dryRun ? 'Serait écrit' : 'Écrit';
    console.log(`${Object.keys(newDays).length} jour(s) ajouté(s)/mis à jour.`);
    for (const file of written) {
        console.log(`${label} : ${path.relative(REPO_ROOT, file)}`);
    }
    checkManifest(written, args.dryRun);
    if (!args.dryRun && written.length > 0) {
        console.log('Penser à régénérer les goldens si des dates couvertes par le CSV Sample ont changé :');
        console.log('  UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"');
    }
}

function parseArgs(argv) {
    const args = { from: null, to: null, dryRun: false, full: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--dry-run') args.dryRun = true;
        else if (arg === '--full') args.full = true;
        else if (arg === '--from' || arg === '--to') {
            const value = argv[++i];
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
                throw new Error(`${arg} : date AAAA-MM-JJ attendue`);
            }
            args[arg.slice(2)] = value;
        } else {
            throw new Error(`argument inconnu "${arg}" (--from, --to, --dry-run, --full)`);
        }
    }
    return args;
}

// Relit les fichiers annuels existants dans un vm avec un stub (pas de
// validation : on veut juste les dates/valeurs brutes).
function loadExistingDays() {
    const days = {};
    if (!fs.existsSync(SPOT_DIR)) return days;
    const files = fs.readdirSync(SPOT_DIR)
        .filter(f => f.startsWith(`${SOURCE_NAME}-`) && f.endsWith('.js'))
        .sort();
    for (const file of files) {
        const sandbox = {
            console,
            defineSpotPrices: (name, daysByDate) => {
                if (name === SOURCE_NAME) Object.assign(days, daysByDate);
            },
        };
        sandbox.window = sandbox;
        vm.createContext(sandbox);
        const code = fs.readFileSync(path.join(SPOT_DIR, file), 'utf8');
        new vm.Script(code, { filename: file }).runInContext(sandbox);
    }
    return days;
}

// Recharge le fichier généré avec la vraie factory defineSpotPrices (et sa
// validation stricte) avant toute écriture : un fichier invalide n'est
// jamais posé dans le repo.
function verifyGeneratedFile(content, file) {
    const libCode = fs.readFileSync(
        path.join(REPO_ROOT, 'scripts', 'tarifs-lib', 'define-tarif.js'), 'utf8');
    const sandbox = { console, abonnements: [] };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    new vm.Script(libCode, { filename: 'define-tarif.js' }).runInContext(sandbox);
    try {
        new vm.Script(content, { filename: path.basename(file) }).runInContext(sandbox);
    } catch (error) {
        throw new Error(`fichier généré invalide (${path.basename(file)}) : ${error.message}`);
    }
}

// Les fichiers d'années doivent figurer dans scripts/tarifs-manifest.js (avant
// les tarifs) : signale toute entrée manquante, notamment à la bascule d'année.
function checkManifest(writtenFiles, dryRun) {
    const manifest = fs.readFileSync(path.join(REPO_ROOT, 'scripts', 'tarifs-manifest.js'), 'utf8');
    for (const file of writtenFiles) {
        const rel = `scripts/tarifs-lib/spot/${path.basename(file)}`;
        if (!manifest.includes(`"${rel}"`)) {
            console.warn(`ATTENTION : ajouter "${rel}" dans scripts/tarifs-manifest.js (avant les tarifs)${dryRun ? ' (dry-run)' : ''}`);
        }
    }
}

// Récupère la plage par tranches annuelles (l'API limite le débit : peu de
// requêtes larges plutôt que beaucoup de petites), dédupliquées par
// timestamp (l'API peut inclure les bornes des deux côtés).
async function fetchRange(from, to) {
    const byTimestamp = new Map();
    for (const [chunkFrom, chunkTo] of yearlyChunks(from, to)) {
        const url = `${API_BASE}&start=${chunkFrom}&end=${chunkTo}`;
        process.stdout.write(`  ${chunkFrom} -> ${chunkTo} ... `);
        const data = await fetchJsonWithRetry(url);
        if (!/EUR\s*\/\s*MWh/.test(data.unit ?? '')) {
            throw new Error(`unité inattendue "${data.unit}" (EUR/MWh attendu) sur ${url}`);
        }
        const seconds = data.unix_seconds ?? [];
        const values = data.price ?? [];
        for (let i = 0; i < seconds.length; i++) {
            byTimestamp.set(seconds[i], values[i]);
        }
        console.log(`${seconds.length} points`);
        await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    }
    const sorted = [...byTimestamp.keys()].sort((a, b) => a - b);
    return {
        unixSeconds: sorted,
        prices: sorted.map(ts => byTimestamp.get(ts)),
    };
}

async function fetchJsonWithRetry(url) {
    for (let attempt = 0; ; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
            return response.json();
        }
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= RETRY_DELAYS_MS.length) {
            throw new Error(`API energy-charts ${response.status} sur ${url}`);
        }
        const delay = RETRY_DELAYS_MS[attempt];
        process.stdout.write(`(${response.status}, nouvel essai dans ${delay / 1000}s) `);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// -> [["2023-01-01", "2023-12-31"], ["2024-01-01", ...], ...]
function yearlyChunks(from, to) {
    const chunks = [];
    let cursor = from;
    while (cursor <= to) {
        const year = Number(cursor.slice(0, 4));
        const lastOfYear = `${year}-12-31`;
        chunks.push([cursor, lastOfYear <= to ? lastOfYear : to]);
        cursor = `${year + 1}-01-01`;
    }
    return chunks;
}

// "AAAA/MM/JJ" -> "AAAA-MM-JJ"
function toIso(date) {
    return date.replaceAll('/', '-');
}

function nextDay(iso) {
    const date = new Date(`${iso}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
}

function todayParis() {
    const parts = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
}
