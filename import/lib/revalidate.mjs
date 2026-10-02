// Garde-fou final avant écriture : recharge l'ensemble des scripts tarifs
// (liste tirée de scripts/tarifs-manifest.js, comme tests/helpers/legacyLoader.mjs) dans un
// contexte VM avec la VRAIE factory defineTarif, en substituant les sources
// patchées. La moindre erreur de validation => on n'écrit rien.
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, listAppScripts } from './tarif-defs.mjs';

// pending: [{ file, newSource }] (chemins relatifs repo, séparateur '/')
// -> { ok: true } | { ok: false, error }
export function revalidateTarifs(pending) {
    const overrides = new Map(pending.map(p => [p.file, p.newSource]));
    const files = listAppScripts();
    // Un fichier patché absent du manifeste (tarif pas encore branché) est
    // tout de même validé, après la lib et les calendriers.
    for (const file of overrides.keys()) {
        if (!files.includes(file)) files.push(file);
    }

    const sandbox = { abonnements: [], console };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    for (const rel of files) {
        const code = overrides.get(rel) ?? fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
        try {
            new vm.Script(code, { filename: rel }).runInContext(context);
        } catch (err) {
            return { ok: false, error: `${rel} : ${err.message}` };
        }
    }
    if (sandbox.tarifDefinitionErrors && sandbox.tarifDefinitionErrors.length > 0) {
        return { ok: false, error: sandbox.tarifDefinitionErrors.join(' | ') };
    }
    return { ok: true };
}

// Recharge une source patchée avec un stub (sans validation) pour vérifier
// que chaque changement attendu est bien présent dans le fichier final.
export function loadDefsFromSource(source, file) {
    const defs = [];
    const sandbox = {
        console,
        defineTarif: def => defs.push({ file, ...def }),
        defineCalendar: () => {},
        defineSpotPrices: () => {},
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    new vm.Script(source, { filename: file }).runInContext(sandbox);
    return defs;
}
