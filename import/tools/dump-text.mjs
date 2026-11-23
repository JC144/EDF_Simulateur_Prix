#!/usr/bin/env node
// Télécharge les grilles PDF (toutes, ou celles d'un fournisseur) et écrit
// le texte extrait dans fixtures/<fournisseur>/<slug>.txt — support de
// l'inspection manuelle et des tests hermétiques des parsers.
//
// Usage : node tools/dump-text.mjs [--provider edf] [--offline]
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { listTarifDefs, groupByPriceUrl } from '../lib/tarif-defs.mjs';
import { fetchGrille, findInCache } from '../lib/download.mjs';
import { loadManifest } from '../lib/manifest.mjs';
import { isPdfUrl, providerFor } from '../lib/registry.mjs';
import { fixtureSlug as slugFor } from '../lib/fixtures.mjs';
import { extractPdf, serializeDocText, serializeDocJson } from '../lib/pdf-text.mjs';

const { values: opts } = parseArgs({
    options: {
        provider: { type: 'string' },
        offline: { type: 'boolean', default: false },
    },
});

const manifest = loadManifest();
const FIXTURES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');

const byUrl = groupByPriceUrl(listTarifDefs());
for (const [url, defs] of byUrl) {
    if (!isPdfUrl(url)) continue;
    const provider = providerFor(url);
    if (!provider) {
        console.warn(`fournisseur inconnu, ignoré : ${url}`);
        continue;
    }
    if (opts.provider && provider !== opts.provider) continue;

    let pdfPath;
    if (opts.offline) {
        pdfPath = findInCache(url, manifest[url]?.sha256);
        if (!pdfPath) {
            console.error(`[SKIP] pas de cache pour ${url}`);
            continue;
        }
    } else {
        try {
            const result = await fetchGrille(url, { force: true });
            pdfPath = result.cachePath;
        } catch (err) {
            console.error(`[ERREUR] ${url} — ${err.message}`);
            continue;
        }
    }

    const doc = await extractPdf(pdfPath);
    const outDir = path.join(FIXTURES_DIR, provider);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${slugFor(url)}.txt`), serializeDocText(doc));
    fs.writeFileSync(path.join(outDir, `${slugFor(url)}.json`), serializeDocJson(doc));
    console.log(`[OK] ${provider}/${slugFor(url)}.{txt,json} (${doc.pages.length} page(s)) — ${defs.map(d => d.name).join(', ')}`);
}
