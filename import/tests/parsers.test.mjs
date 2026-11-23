// Tests hermétiques des parsers : chaque fixture JSON committée doit
// produire exactement le snapshot .expected.json committé, et la sortie
// doit couvrir toutes les offres defineTarif rattachées à l'URL.
// Régénération des snapshots : node tools/gen-expected.mjs (puis relire
// le diff).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { listTarifDefs, groupByPriceUrl } from '../lib/tarif-defs.mjs';
import { providerFor, isPdfUrl } from '../lib/registry.mjs';
import { fixtureSlug, trackedGrid } from '../lib/fixtures.mjs';
import { loadFixture } from '../lib/pdf-text.mjs';

const IMPORT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const definitions = listTarifDefs();

test('chaque tarif publié référence une grille de son fournisseur', () => {
    for (const def of definitions) {
        assert.ok(def.price_url, def.name);
        assert.equal(providerFor(def.price_url), def.file.split('/')[2], def.name);
    }
});

const byUrl = groupByPriceUrl(definitions);

for (const [url, defs] of byUrl) {
    if (!isPdfUrl(url)) continue;
    const provider = providerFor(url);
    if (!provider) continue;
    const slug = fixtureSlug(url);
    const fixturePath = path.join(IMPORT_DIR, 'fixtures', provider, `${slug}.json`);
    const expectedPath = path.join(IMPORT_DIR, 'fixtures', provider, `${slug}.expected.json`);
    const parserPath = path.join(IMPORT_DIR, 'parsers', `${provider}.mjs`);
    if (!fs.existsSync(parserPath)) continue;

    test(`${provider}/${slug}`, async () => {
        assert.ok(fs.existsSync(fixturePath), `fixture manquante : ${fixturePath} (node tools/dump-text.mjs)`);
        assert.ok(fs.existsSync(expectedPath), `snapshot manquant : ${expectedPath} (node tools/gen-expected.mjs)`);

        const parser = await import(`../parsers/${provider}.mjs`);
        const parsed = parser.parse(loadFixture(fixturePath), url);

        const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
        assert.deepEqual(trackedGrid(parsed, defs), trackedGrid(expected, defs));
    });
}
