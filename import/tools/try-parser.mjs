#!/usr/bin/env node
// Mise au point des parsers : exécute le parser d'un fournisseur sur ses
// fixtures JSON et affiche la réconciliation avec les valeurs actuelles du
// repo (changements détectés + divergences structurelles).
//
// Usage : node tools/try-parser.mjs <fournisseur> [--json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { listTarifDefs, groupByPriceUrl } from '../lib/tarif-defs.mjs';
import { providerFor, isPdfUrl } from '../lib/registry.mjs';
import { reconcileOffer } from '../lib/reconcile.mjs';
import { loadFixture } from '../lib/pdf-text.mjs';

const provider = process.argv[2];
const asJson = process.argv.includes('--json');
if (!provider) {
    console.error('Usage : node tools/try-parser.mjs <fournisseur> [--json]');
    process.exit(2);
}
if (!/^[a-zA-Z0-9_-]+$/.test(provider)) {
    console.error('Erreur : fournisseur invalide (caractères autorisés : lettres, chiffres, - et _)');
    process.exit(2);
}

const IMPORT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parser = await import(`../parsers/${provider}.mjs`);

function slugFor(url) {
    return path.basename(new URL(url).pathname, '.pdf')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const byUrl = groupByPriceUrl(listTarifDefs());
let exitCode = 0;
for (const [url, defs] of byUrl) {
    if (!isPdfUrl(url) || providerFor(url) !== provider) continue;
    const fixturePath = path.join(IMPORT_DIR, 'fixtures', provider, `${slugFor(url)}.json`);
    if (!fs.existsSync(fixturePath)) {
        console.log(`\n### ${slugFor(url)} : PAS DE FIXTURE (${fixturePath})`);
        exitCode = 1;
        continue;
    }
    console.log(`\n### ${slugFor(url)}`);
    let parsed;
    try {
        parsed = parser.parse(loadFixture(fixturePath), url);
    } catch (err) {
        console.log(`  ERREUR PARSING : ${err.message}`);
        exitCode = 1;
        continue;
    }
    if (asJson) console.log(JSON.stringify(parsed, null, 2));
    console.log(`  gridDate : ${parsed.gridDate}`);
    for (const def of defs) {
        const offer = parsed.offers[def.name];
        if (!offer) {
            console.log(`  ${def.name} : OFFRE ABSENTE de la sortie du parser`);
            exitCode = 1;
            continue;
        }
        const { changes, issues } = reconcileOffer(def, offer, parsed.gridDate || 'DATE-INCONNUE');
        for (const issue of issues) {
            console.log(`  ${def.name} : STRUCTURE : ${issue}`);
            exitCode = 1;
        }
        if (changes.length === 0 && issues.length === 0) {
            console.log(`  ${def.name} : identique au repo`);
        }
        for (const c of changes) {
            console.log(`  ${def.name} : ${c.path.join('.')} ${c.old} -> ${c.new}`);
        }
    }
    const extra = Object.keys(parsed.offers).filter(n => !defs.some(d => d.name === n));
    if (extra.length) console.log(`  (offres du parser sans tarif repo : ${extra.join(', ')})`);
}
process.exit(exitCode);
