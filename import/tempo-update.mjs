#!/usr/bin/env node
// Mise à jour manuelle des calendriers Tempo et EJP depuis l'API officielle
// EDF (api-commerce.edf.fr) :
//   node tempo-update.mjs [--option TEMPO|EJP] [--from AAAA-MM-JJ] [--to AAAA-MM-JJ] [--dry-run] [--full]
//
// Incrémental par défaut : re-fetche depuis le lendemain de la dernière date
// spéciale connue de chaque calendrier (scripts/tarifs-lib/calendars/*.js).
// --full re-fetche tout l'historique depuis 2020-11-01 et remplace les listes
// (premier run obligatoire en --full pour purger les erreurs saisies à la
// main). Les jours futurs non annoncés (NON_DEFINI) sont ignorés.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { isDeepStrictEqual } from 'node:util';
import { REPO_ROOT, listAppScripts } from './lib/tarif-defs.mjs';
import {
    CALENDARS, parseCalendarResponse, daysByType, mergeDaysByType,
    diffDaysByType, serializeCalendarFile, yearlyChunks,
} from './lib/tempo-data.mjs';

const API_BASE = 'https://api-commerce.edf.fr/commerce/activet/v1/calendrier-jours-effacement';
// Sans ces deux en-têtes (ceux du site particulier.edf.fr), l'API répond 400.
const API_HEADERS = {
    'application-origine-controlee': 'site_RC',
    'situation-usage': 'Jours Effacement',
};
const DEFAULT_START = '2020-11-01'; // début de l'historique disponible côté API
const FETCH_DELAY_MS = 2000;
const RETRY_DELAYS_MS = [5000, 15000, 45000]; // sur 429/5xx

main().catch(error => {
    console.error(`Erreur : ${error.message}`);
    process.exitCode = 1;
});

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const configs = args.option ? [CALENDARS[args.option]] : Object.values(CALENDARS);
    const scripts = listAppScripts();
    let written = false;
    for (const config of configs) {
        if (!scripts.includes(config.relativePath)) {
            console.log(`${config.calendarName} : calendrier retiré du manifeste.`);
            continue;
        }
        const { days, changed } = await updateCalendar(config, args);
        if (config.option === 'TEMPO') syncTempoContract(days, args.dryRun);
        written ||= changed;
    }
    if (written && !args.dryRun) {
        console.log('Relire le diff et lancer les tests. La commande suivante accepte les nouveaux résultats après vérification.');
        console.log('  UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"');
    }
}

// Renvoie le calendrier complet, y compris en aperçu et quand il est déjà à jour.
async function updateCalendar(config, args) {
    const file = path.join(REPO_ROOT, ...config.relativePath.split('/'));
    // Toujours relu, même en --full : sert au rapport ajouts/retraits.
    const existing = loadExistingDaysByType(config, file);
    const lastKnown = Object.values(existing).flat().sort().at(-1);

    const from = args.from
        ?? (args.full || !lastKnown ? DEFAULT_START : nextDay(toIso(lastKnown)));
    // La couleur du lendemain est annoncée vers 11h ; tant qu'elle ne l'est
    // pas, l'API renvoie NON_DEFINI, ignoré sans erreur.
    const to = args.to ?? nextDay(todayParis());
    if (from > to) {
        console.log(`${config.calendarName} : à jour (dernière date connue ${lastKnown}).`);
        return { days: existing, changed: false };
    }
    console.log(`${config.calendarName} : récupération ${from} -> ${to}`);

    const entries = await fetchRange(config, from, to);
    const inRange = entries.filter(e => e.date >= from && e.date <= to);
    const fetched = daysByType(inRange, config);
    const next = args.full
        ? fetched
        : mergeDaysByType(existing, fetched, [toSlash(from), toSlash(to)]);

    reportDiff(config, diffDaysByType(existing, next));

    const content = serializeCalendarFile(config, next);
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) {
        console.log(`${config.calendarName} : aucun changement.`);
        return { days: next, changed: false };
    }
    verifyGeneratedFile(content, file);
    if (!args.dryRun) {
        fs.writeFileSync(file, content);
    }
    console.log(`${args.dryRun ? 'Serait écrit' : 'Écrit'} : ${config.relativePath}`);
    return { days: next, changed: true };
}

function syncTempoContract(days, dryRun) {
    const relativePath = 'tests/golden/contracts-edf.json';
    const file = path.join(REPO_ROOT, relativePath);
    const contracts = JSON.parse(fs.readFileSync(file, 'utf8'));
    const tempo = contracts.find(contract => contract.name === 'EDF - Tempo');
    if (!tempo) return; // Le calendrier peut servir à un autre contrat après le retrait de Tempo.

    let changed = false;
    for (const color of Object.keys(CALENDARS.TEMPO.types)) {
        const group = tempo.specialDays.find(entry => entry.name === color);
        if (!Array.isArray(group?.lastDays) || !Array.isArray(days[color])) {
            throw new Error(`Liste des jours « ${color} » absente du calendrier ou de la référence EDF - Tempo`);
        }
        if (!isDeepStrictEqual(group.lastDays, days[color])) {
            group.lastDays = days[color];
            changed = true;
        }
    }
    if (!changed) return;
    if (!dryRun) fs.writeFileSync(file, JSON.stringify(contracts, null, 2) + '\n');
    console.log(`Référence des jours Tempo ${dryRun ? 'à synchroniser' : 'synchronisée'} dans ${relativePath}.`);
}

function reportDiff(config, { added, removed }) {
    for (const type of Object.keys(config.types)) {
        const parts = [];
        if (added[type].length > 0) parts.push(`+${added[type].length} ajouté(s) : ${added[type].join(', ')}`);
        if (removed[type].length > 0) parts.push(`-${removed[type].length} retiré(s) : ${removed[type].join(', ')}`);
        if (parts.length > 0) console.log(`  ${type} : ${parts.join(' ; ')}`);
    }
}

function parseArgs(argv) {
    const args = { option: null, from: null, to: null, dryRun: false, full: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--dry-run') args.dryRun = true;
        else if (arg === '--full') args.full = true;
        else if (arg === '--option') {
            const value = argv[++i];
            if (!CALENDARS[value]) {
                throw new Error(`--option : ${Object.keys(CALENDARS).join(' ou ')} attendu`);
            }
            args.option = value;
        } else if (arg === '--from' || arg === '--to') {
            const value = argv[++i];
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) {
                throw new Error(`${arg} : date AAAA-MM-JJ attendue`);
            }
            args[arg.slice(2)] = value;
        } else {
            throw new Error(`argument inconnu "${arg}" (--option, --from, --to, --dry-run, --full)`);
        }
    }
    return args;
}

// Relit le fichier calendrier existant dans un vm avec un stub (pas de
// validation : on veut juste les listes de dates par type).
function loadExistingDaysByType(config, file) {
    const days = {};
    if (!fs.existsSync(file)) return days;
    const sandbox = {
        console,
        defineCalendar: (name, byType) => {
            if (name !== config.calendarName) return;
            for (const [type, entry] of Object.entries(byType)) {
                days[type] = [...(entry.days ?? [])];
            }
        },
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    const code = fs.readFileSync(file, 'utf8');
    new vm.Script(code, { filename: path.basename(file) }).runInContext(sandbox);
    return days;
}

// Recharge le fichier généré avec la vraie factory defineCalendar (et sa
// validation stricte) avant toute écriture : un fichier invalide n'est
// jamais posé dans le repo. Sandbox neuf à chaque appel (un calendrier
// déjà défini est refusé par la factory).
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

// Récupère la plage par tranches d'au plus un an (l'API refuse les plages
// plus larges), dédupliquées par date (les bornes peuvent se chevaucher).
async function fetchRange(config, from, to) {
    const byDate = new Map();
    const chunks = yearlyChunks(from, to);
    for (const [chunkFrom, chunkTo] of chunks) {
        const url = `${API_BASE}?option=${config.option}&dateApplicationBorneInf=${chunkFrom}`
            + `&dateApplicationBorneSup=${chunkTo}&identifiantConsommateur=src`;
        process.stdout.write(`  ${chunkFrom} -> ${chunkTo} ... `);
        const json = await fetchJsonWithRetry(url);
        const entries = parseCalendarResponse(json, config.option);
        for (const entry of entries) {
            byDate.set(entry.date, entry);
        }
        console.log(`${entries.length} jour(s)`);
        if (chunks.length > 1) {
            await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
        }
    }
    return [...byDate.values()].sort((a, b) => a.date < b.date ? -1 : 1);
}

async function fetchJsonWithRetry(url) {
    for (let attempt = 0; ; attempt++) {
        const response = await fetch(url, { headers: API_HEADERS });
        if (response.ok) {
            return response.json();
        }
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= RETRY_DELAYS_MS.length) {
            throw new Error(`API EDF ${response.status} sur ${url}`);
        }
        const delay = RETRY_DELAYS_MS[attempt];
        process.stdout.write(`(${response.status}, nouvel essai dans ${delay / 1000}s) `);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// "AAAA/MM/JJ" -> "AAAA-MM-JJ"
function toIso(date) {
    return date.replaceAll('/', '-');
}

// "AAAA-MM-JJ" -> "AAAA/MM/JJ"
function toSlash(iso) {
    return iso.replaceAll('-', '/');
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
