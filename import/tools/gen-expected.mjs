#!/usr/bin/env node
// Régénère les snapshots fixtures/<fournisseur>/<slug>.expected.json à
// partir de la sortie actuelle des parsers sur les fixtures JSON.
// À relancer (et relire le diff !) après une évolution volontaire d'un
// parser ou d'une grille.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { listTarifDefs, groupByPriceUrl } from '../lib/tarif-defs.mjs';
import { providerFor, isPdfUrl } from '../lib/registry.mjs';
import { fixtureSlug, trackedGrid } from '../lib/fixtures.mjs';
import { loadFixture } from '../lib/pdf-text.mjs';

const IMPORT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const [url, defs] of groupByPriceUrl(listTarifDefs())) {
    if (!isPdfUrl(url)) continue;
    const provider = providerFor(url);
    if (!provider) continue;
    const parserPath = path.join(IMPORT_DIR, 'parsers', `${provider}.mjs`);
    const fixturePath = path.join(IMPORT_DIR, 'fixtures', provider, `${fixtureSlug(url)}.json`);
    if (!fs.existsSync(parserPath) || !fs.existsSync(fixturePath)) continue;

    const parser = await import(`../parsers/${provider}.mjs`);
    const parsed = parser.parse(loadFixture(fixturePath), url);
    const outPath = fixturePath.replace(/\.json$/, '.expected.json');
    fs.writeFileSync(outPath, JSON.stringify(trackedGrid(parsed, defs), null, 2) + '\n');
    console.log(`[OK] ${path.relative(IMPORT_DIR, outPath)}`);
}
