// Charge les scripts classiques de tarifs (scripts/tarifs/**, scripts/tarifs-lib/**,
// tous déclaratifs via defineTarif) dans un contexte node:vm frais, comme le
// ferait le navigateur via scripts/tarifs-manifest.js. Un état frais à chaque appel est
// indispensable : runSimulation mute les abonnements (remplacement de hc,
// accumulation de specialDays).
import vm from 'node:vm';
import fs from 'node:fs';

const ROOT = new URL('../../', import.meta.url);

// La liste des scripts vient de scripts/tarifs-manifest.js : les tests couvrent
// exactement ce que l'application charge, et suivent les ajouts/retraits de tarifs.
export function listTarifScripts() {
    const manifest = fs.readFileSync(new URL('scripts/tarifs-manifest.js', ROOT), 'utf8');
    const matches = manifest.matchAll(/"(scripts\/(?:tarifs|tarifs-lib)\/[^"]+\.js)"/g);
    return [...matches].map(m => m[1]);
}

// Sandbox complet (window, abonnements, defineTarif si tarifs-lib est chargé) :
// utile pour tester la factory defineTarif elle-même.
export function createTarifSandbox({ files = listTarifScripts() } = {}) {
    const sandbox = { abonnements: [], console };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    for (const rel of files) {
        const code = fs.readFileSync(new URL(rel, ROOT), 'utf8');
        new vm.Script(code, { filename: rel }).runInContext(context);
    }
    return sandbox;
}

export function loadAbonnements(options) {
    return createTarifSandbox(options).abonnements;
}

// Installe un registre frais consommé par scripts/core/tarifsRegistry.js
// (qui lit window.abonnements). À appeler avant chaque runSimulation.
export function installFreshRegistry(options) {
    const abonnements = loadAbonnements(options);
    globalThis.window = globalThis;
    globalThis.abonnements = abonnements;
    return abonnements;
}
