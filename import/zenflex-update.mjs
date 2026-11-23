#!/usr/bin/env node
// Mise à jour manuelle du calendrier des jours de sobriété Zenflex depuis
// l'API OPM d'EDF (particulier.edf.fr) :
//   node zenflex-update.mjs [--from AAAA-MM-JJ] [--to AAAA-MM-JJ] [--dry-run] [--full]
//
// Incrémental par défaut : re-fetche depuis le lendemain de la dernière date
// de sobriété connue (scripts/tarifs-lib/calendars/zenflex-sobriete.js).
// --full re-fetche tout l'historique disponible côté API (depuis 2023-09-01)
// et remplace cette fenêtre. Contrairement à tempo-update.mjs, les jours
// antérieurs sont toujours préservés : l'API n'a pas d'historique avant la
// saison 2023-2024 (les jours de sobriété connus de 2020-2022 y répondent RAS).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { REPO_ROOT, listAppScripts } from './lib/tarif-defs.mjs';
import { ZENFLEX, parseOpmResponse, requestDates, nextDay } from './lib/zenflex-data.mjs';
import {
    daysByType, mergeDaysByType, diffDaysByType, serializeCalendarFile,
} from './lib/tempo-data.mjs';

const API_BASE = 'https://particulier.edf.fr/services/rest/opm/getOPMStatut';
// Aucun en-tête particulier requis (contrairement à api-commerce.edf.fr).
const DEFAULT_START = '2023-09-01'; // début de l'historique disponible côté API
// Une requête ne couvre que deux jours : délai plus court que tempo-update
// (un --full représente ~500 requêtes).
const FETCH_DELAY_MS = 500;
const RETRY_DELAYS_MS = [5000, 15000, 45000]; // sur 429/5xx

main().catch(error => {
    console.error(`Erreur : ${error.message}`);
    process.exitCode = 1;
});

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!listAppScripts().includes(ZENFLEX.relativePath)) {
        console.log('Zenflex : calendrier retiré du manifeste.');
        return;
    }
    const written = await updateCalendar(ZENFLEX, args);
    if (written && !args.dryRun) {
        console.log('Penser à relire git diff puis régénérer les goldens :');
        console.log('  UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"');
    }
}

// -> true si le fichier du calendrier a été (ou serait, en dry-run) écrit.
async function updateCalendar(config, args) {
    const file = path.join(REPO_ROOT, ...config.relativePath.split('/'));
    // Toujours relu, même en --full : sert à la fusion et au rapport.
    const existing = loadExistingDaysByType(config, file);
    const lastKnown = Object.values(existing).flat().sort().at(-1);

    const from = args.from
        ?? (args.full || !lastKnown ? DEFAULT_START : nextDay(toIso(lastKnown)));
    // La couleur du lendemain est annoncée la veille ; tant qu'elle ne l'est
    // pas, l'API renvoie NON_DETERMINE, ignoré sans erreur.
    const to = args.to ?? nextDay(todayParis());
    if (from > to) {
        console.log(`${config.calendarName} : à jour (dernière date connue ${lastKnown}).`);
        return false;
    }
    console.log(`${config.calendarName} : récupération ${from} -> ${to}`);

    const entries = await fetchEntries(from, to);
    const fetched = daysByType(entries, config);
    // Fusion aussi en --full : seule la fenêtre effectivement couverte par le
    // fetch est remplacée, les jours antérieurs (hors historique API) restent.
    const lastCovered = entries.at(-1).date; // peut dépasser to d'un jour (couleurJourJ1)
    const next = mergeDaysByType(existing, fetched, [toSlash(from), toSlash(lastCovered)]);

    reportDiff(config, diffDaysByType(existing, next));

    const content = serializeCalendarFile(config, next);
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) {
        console.log(`${config.calendarName} : aucun changement.`);
        return false;
    }
    verifyGeneratedFile(content, file);
    if (!args.dryRun) {
        fs.writeFileSync(file, content);
    }
    console.log(`${args.dryRun ? 'Serait écrit' : 'Écrit'} : ${config.relativePath}`);
    return true;
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

// Une requête par paire de jours (couleurJourJ + couleurJourJ1), en séquence.
async function fetchEntries(from, to) {
    const dates = requestDates(from, to);
    console.log(`  ${dates.length} requête(s) (2 jours couverts par requête)`);
    const entries = [];
    for (const [index, date] of dates.entries()) {
        const json = await fetchJsonWithRetry(`${API_BASE}?dateRelevant=${date}`);
        entries.push(...parseOpmResponse(json, date));
        if ((index + 1) % 50 === 0) {
            console.log(`  ... ${index + 1}/${dates.length}`);
        }
        if (index < dates.length - 1) {
            await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
        }
    }
    return entries;
}

async function fetchJsonWithRetry(url) {
    for (let attempt = 0; ; attempt++) {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            // L'API répond 200 avec un corps vide sur une date invalide.
            if (text === '') {
                throw new Error(`réponse vide de l'API OPM sur ${url} (date invalide ?)`);
            }
            return JSON.parse(text);
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

function todayParis() {
    const parts = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
}
