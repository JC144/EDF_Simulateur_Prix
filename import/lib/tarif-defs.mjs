// Énumère toutes les définitions defineTarif du repo en exécutant chaque
// fichier de scripts/tarifs/** dans un contexte node:vm avec un stub
// defineTarif (pas de validation : on veut les littéraux bruts, y compris
// pour un fichier que l'application ne chargerait pas encore).
// Même technique que tests/helpers/legacyLoader.mjs, mais par glob de
// fichiers plutôt que par lecture d'index.html.
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const TARIFS_DIR = path.join(REPO_ROOT, 'scripts', 'tarifs');

export function listTarifFiles() {
    return fs.readdirSync(TARIFS_DIR, { recursive: true })
        .map(String)
        .filter(rel => rel.endsWith('.js'))
        .map(rel => path.join('scripts', 'tarifs', rel).replaceAll('\\', '/'))
        .sort();
}

// -> [{ file, name, price_url, lastUpdate, subscriptions, dayTypes, priceOverrides, ... }]
export function listTarifDefs() {
    const defs = [];
    for (const file of listTarifFiles()) {
        const code = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
        const sandbox = {
            console,
            defineTarif: def => defs.push({ file, ...def }),
            defineCalendar: () => {},
            defineSpotPrices: () => {},
        };
        sandbox.window = sandbox;
        vm.createContext(sandbox);
        new vm.Script(code, { filename: file }).runInContext(sandbox);
    }
    return defs;
}

// Regroupe les définitions par price_url (un même PDF peut couvrir
// plusieurs offres, voire plusieurs fichiers).
// -> Map<url, defs[]>
export function groupByPriceUrl(defs = listTarifDefs()) {
    const byUrl = new Map();
    for (const def of defs) {
        if (!def.price_url) continue;
        if (!byUrl.has(def.price_url)) byUrl.set(def.price_url, []);
        byUrl.get(def.price_url).push(def);
    }
    return byUrl;
}

// Scripts tarifs effectivement chargés par l'application, dans l'ordre de
// scripts/tarifs-manifest.js (lib, calendriers, données spot, puis tarifs).
export function listAppScripts() {
    const manifest = fs.readFileSync(path.join(REPO_ROOT, 'scripts', 'tarifs-manifest.js'), 'utf8');
    const matches = manifest.matchAll(/"(scripts\/(?:tarifs|tarifs-lib)\/[^"]+\.js)"/g);
    return [...matches].map(m => m[1]);
}

// Exécute les scripts de l'application avec la VRAIE factory defineTarif
// (validation comprise) et renvoie les abonnements construits (champ display
// notamment) et les calendriers. Lève à la moindre erreur de définition.
// -> { abonnements, calendars }
export function loadBuiltTarifs() {
    const sandbox = { abonnements: [], console };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    for (const rel of listAppScripts()) {
        const code = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
        new vm.Script(code, { filename: rel }).runInContext(context);
    }
    const errors = sandbox.tarifDefinitionErrors ?? [];
    if (errors.length > 0) {
        throw new Error('Définitions de tarifs invalides :\n' + errors.join('\n'));
    }
    return { abonnements: sandbox.abonnements, calendars: sandbox.TarifCalendars ?? {} };
}
