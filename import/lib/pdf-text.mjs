// Extraction du texte d'un PDF via pdfjs-dist, en conservant les
// coordonnées de chaque fragment. Les grilles tarifaires posent souvent
// deux tableaux côte à côte (option Base / option HP-HC) dont les lignes
// se mélangent si l'on sérialise naïvement : chaque parser peut donc
// re-clusteriser les items par zone (filtre en X) via buildLines().
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const Y_TOLERANCE = 2.5;   // pts : items à moins de 2.5pt de Y = même ligne
const CELL_GAP = 6;        // pts : écart horizontal minimal pour couper une cellule

// -> { pages: [{ items: [{ str, x, y, w }], width, height }] }
export async function extractPdf(filePath) {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const sha256 = createHash('sha256').update(data).digest('hex');
    const doc = await getDocument({ data, isEvalSupported: false, useSystemFonts: true }).promise;
    const pages = [];
    try {
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const viewport = page.getViewport({ scale: 1 });
            const content = await page.getTextContent();
            const items = content.items
                .filter(it => it.str !== undefined && it.str.trim() !== '')
                .map(it => ({
                    str: it.str.replace(/\s+/g, ' ').trim(),
                    x: Math.round(it.transform[4] * 100) / 100,
                    y: Math.round(it.transform[5] * 100) / 100,
                    w: Math.round((it.width || 0) * 100) / 100,
                }));
            pages.push({ items, width: viewport.width, height: viewport.height });
            page.cleanup();
        }
    } finally {
        await doc.destroy();
    }
    return { pages, sha256 };
}

// Regroupe des items en lignes physiques : tri Y décroissant, clustering
// avec tolérance, cellules coupées sur les écarts horizontaux.
// options : { xMin, xMax } pour ne garder qu'une zone (tableau de gauche /
// de droite), { yTolerance, cellGap } pour ajuster le clustering.
// -> [{ y, cells: [string], text }]
export function buildLines(items, { xMin = -Infinity, xMax = Infinity, yTolerance = Y_TOLERANCE, cellGap = CELL_GAP } = {}) {
    const kept = items
        .filter(it => it.x >= xMin && it.x < xMax)
        .sort((a, b) => b.y - a.y || a.x - b.x);

    const clusters = [];
    let current = null;
    for (const it of kept) {
        if (!current || Math.abs(current.y - it.y) > yTolerance) {
            current = { y: it.y, items: [it] };
            clusters.push(current);
        } else {
            current.items.push(it);
        }
    }

    return clusters.map(cluster => {
        cluster.items.sort((a, b) => a.x - b.x);
        // Cellules ("spans") avec leur étendue horizontale : indispensable
        // pour raccrocher une cellule à sa colonne de tableau.
        const spans = [];
        let span = null;
        let prevEnd = null;
        for (const it of cluster.items) {
            if (span === null || (prevEnd !== null && it.x - prevEnd > cellGap)) {
                span = { text: it.str, x0: it.x, x1: it.x + it.w };
                spans.push(span);
            } else {
                span.text += ' ' + it.str;
                span.x1 = it.x + it.w;
            }
            prevEnd = it.x + it.w;
        }
        for (const s of spans) s.text = s.text.replace(/\s+/g, ' ').trim();
        const kept = spans.filter(s => s.text !== '');
        return { y: cluster.y, cells: kept.map(s => s.text), spans: kept, text: kept.map(s => s.text).join('\t') };
    });
}

// Texte lisible d'une page entière (inspection humaine, fixtures .txt).
export function pageToText(page, options) {
    return buildLines(page.items, options).map(l => l.text).join('\n');
}

export function serializeDocText(doc) {
    return doc.pages
        .map((p, i) => `=== PAGE ${i + 1} ===\n${pageToText(p)}`)
        .join('\n\n') + '\n';
}

// Fixtures JSON : la sortie brute d'extractPdf, réutilisable par les tests
// des parsers sans re-télécharger ni re-parser le PDF.
export function serializeDocJson(doc) {
    return JSON.stringify(doc, null, 1) + '\n';
}

export function loadFixture(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}
