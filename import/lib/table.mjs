// Extraction générique des tableaux de grilles tarifaires « une ligne par
// puissance kVA, une colonne par prix ». Gère :
//  - plusieurs tableaux par page (côte à côte ou empilés), découverts via
//    les colonnes de kVA alignées verticalement ;
//  - les colonnes « fusionnées » (un prix couvrant plusieurs lignes,
//    vertical-centré) : attribution par partition contiguë des lignes
//    minimisant l'écart entre le centre du groupe et la position du prix ;
//  - les chiffres éclatés par des espaces (réparés par parseFrNumber au
//    niveau des cellules).
import { buildLines } from './pdf-text.mjs';
import { parseFrNumber, euroPerKwhToCents } from './fr-numbers.mjs';

export const KVAS = ['3', '6', '9', '12', '15', '18', '24', '30', '36'];
const KVA_SET = new Set(KVAS);

// Cellule de puissance : "6", "6 kVA"... Certaines grilles (TotalEnergies)
// listent toutes les puissances entières de 3 à 36.
const KVA_CELL_RE = /^(\d{1,2})\s*(?:kVA)?$/i;

function kvaOf(text) {
    const m = text.match(KVA_CELL_RE);
    if (!m) return null;
    const n = Number(m[1]);
    return n >= 1 && n <= 36 ? String(n) : null;
}

const KVA_X_TOL = 5;        // pts : alignement vertical d'une colonne de kVA
const TABLE_GAP = 60;       // pts : écart vertical séparant deux tableaux
const COL_X_TOL = 14;       // pts : regroupement des valeurs d'une même colonne
const MIN_ROWS = 3;

// Découvre les tableaux d'une page via les items kVA alignés.
// -> [{ page, kvaX, rows: [{ kva, y }], yTop, yBottom, spacing }]
export function findKvaTables(doc) {
    const tables = [];
    doc.pages.forEach((page, pageIndex) => {
        // Candidats kVA sur les CELLULES reconstituées (pas les items bruts) :
        // les chiffres éclatés ("1 9 , 56") fusionnent dans leur cellule et ne
        // produisent plus de faux kVA isolés.
        const kvaItems = [];
        for (const line of buildLines(page.items)) {
            for (const span of line.spans) {
                const kva = kvaOf(span.text);
                if (kva !== null) kvaItems.push({ str: kva, x: span.x0, y: line.y });
            }
        }
        kvaItems.sort((a, b) => a.x - b.x);

        // Cluster par X.
        const xClusters = [];
        for (const it of kvaItems) {
            const cluster = xClusters.find(c => Math.abs(c.x - it.x) <= KVA_X_TOL);
            if (cluster) {
                cluster.items.push(it);
                cluster.x = Math.min(cluster.x, it.x);
            } else {
                xClusters.push({ x: it.x, items: [it] });
            }
        }

        // Découpe de chaque cluster X sur les trous verticaux.
        for (const cluster of xClusters) {
            cluster.items.sort((a, b) => b.y - a.y);
            let group = null;
            const groups = [];
            for (const it of cluster.items) {
                if (!group || group[group.length - 1].y - it.y > TABLE_GAP) {
                    group = [];
                    groups.push(group);
                }
                group.push(it);
            }
            for (const rows of groups) {
                if (rows.length < MIN_ROWS) continue;
                const ys = rows.map(r => r.y);
                const diffs = ys.slice(1).map((y, i) => ys[i] - y);
                const spacing = diffs.sort((a, b) => a - b)[Math.floor(diffs.length / 2)];
                tables.push({
                    page: pageIndex,
                    kvaX: cluster.x,
                    rows: rows.map(r => ({ kva: r.str, y: r.y })),
                    yTop: ys[0] + spacing * 0.7,
                    yBottom: ys[ys.length - 1] - spacing * 0.7,
                    spacing,
                });
            }
        }
    });

    // Ordre de lecture : page, puis bande verticale (haut de page d'abord),
    // puis gauche -> droite pour les tableaux côte à côte.
    tables.sort((a, b) =>
        a.page - b.page
        || Math.round((b.yTop - a.yTop) / TABLE_GAP)
        || a.kvaX - b.kvaX);
    return tables;
}

// Partition contiguë de `rowYs` (tri décroissant) en `groupYs.length`
// segments minimisant Σ |centre(segment) - y du groupe|.
// -> tableau des tailles de segments.
export function bestPartition(rowYs, groupYs) {
    const n = rowYs.length;
    const g = groupYs.length;
    let best = null;

    function recurse(start, groupIndex, sizes, cost) {
        if (groupIndex === g) {
            if (start === n && (best === null || cost < best.cost)) best = { sizes: [...sizes], cost };
            return;
        }
        const remainingGroups = g - groupIndex - 1;
        for (let size = 1; size <= n - start - remainingGroups; size++) {
            const seg = rowYs.slice(start, start + size);
            const center = (seg[0] + seg[seg.length - 1]) / 2;
            recurse(start + size, groupIndex + 1, [...sizes, size], cost + Math.abs(center - groupYs[groupIndex]));
        }
    }
    recurse(0, 0, [], 0);
    if (!best) throw new Error(`partition impossible : ${n} lignes pour ${g} groupes`);
    return best.sizes;
}

// Extrait les valeurs d'un tableau : `colCount` colonnes numériques
// attendues après la colonne kVA (abonnement inclus).
// xMax : borne droite de la zone (début du tableau voisin, sinon Infinity).
// -> [{ kva, values: [v0, ..., v(colCount-1)] }]
export function extractTableValues(doc, table, xMax, colCount, label, { cellGap } = {}) {
    const page = doc.pages[table.page];
    const zoneItems = page.items.filter(it =>
        it.x >= table.kvaX - 8 && it.x < xMax
        && it.y <= table.yTop && it.y >= table.yBottom);

    const lines = buildLines(zoneItems, cellGap ? { cellGap } : {});

    // Valeurs numériques : cellules des lignes de la zone, hors cellules kVA
    // (reconnues par leur valeur ET leur position dans la colonne des kVA).
    const numericSpans = [];
    for (const line of lines) {
        for (const span of line.spans) {
            if (kvaOf(span.text) !== null && Math.abs(span.x0 - table.kvaX) <= KVA_X_TOL + 3) continue;
            const v = parseFrNumber(span.text);
            if (v !== null) numericSpans.push({ ...span, y: line.y, value: v });
        }
    }

    // Colonnes par clustering X (sur le début de cellule).
    const columns = [];
    for (const span of numericSpans.sort((a, b) => a.x0 - b.x0)) {
        const col = columns.find(c => Math.abs(c.x - span.x0) <= COL_X_TOL);
        if (col) col.spans.push(span);
        else columns.push({ x: span.x0, spans: [span] });
    }
    if (columns.length !== colCount) {
        throw new Error(`${label} : ${columns.length} colonne(s) numérique(s) trouvée(s), ${colCount} attendue(s) (x: ${columns.map(c => Math.round(c.x)).join(', ')})`);
    }

    const rows = table.rows.map(r => ({ kva: r.kva, y: r.y, values: [] }));
    for (const col of columns.sort((a, b) => a.x - b.x)) {
        const spans = col.spans.sort((a, b) => b.y - a.y);
        if (spans.length === rows.length) {
            // Une valeur par ligne : appariement dans l'ordre vertical.
            spans.forEach((span, i) => {
                if (Math.abs(span.y - rows[i].y) > table.spacing) {
                    throw new Error(`${label} : colonne x≈${Math.round(col.x)} désalignée (valeur ${span.text} à y=${Math.round(span.y)} pour la ligne ${rows[i].kva} kVA à y=${Math.round(rows[i].y)})`);
                }
                rows[i].values.push(span.value);
            });
        } else if (spans.length < rows.length) {
            // Colonne fusionnée : chaque valeur couvre un bloc contigu de lignes.
            const sizes = bestPartition(rows.map(r => r.y), spans.map(s => s.y));
            let index = 0;
            spans.forEach((span, g) => {
                for (let k = 0; k < sizes[g]; k++) rows[index++].values.push(span.value);
            });
        } else {
            throw new Error(`${label} : colonne x≈${Math.round(col.x)} : ${spans.length} valeurs pour ${rows.length} lignes`);
        }
    }
    return rows.map(({ kva, values }) => ({ kva, values }));
}

// Construit { subscriptions, dayTypes, priceOverrides? } à partir des
// lignes [{ kva, values: [abonnement, prix...] }]. cols décrit chaque
// colonne de prix par ses chemins "type.champ" dans dayTypes ; un chemin
// "=type.champ" est une assertion d'égalité avec un champ déjà rempli
// (colonne dupliquée du PDF non modélisée dans le repo).
// Référence = ligne de plus grande puissance ; toute ligne qui s'en écarte
// devient un priceOverride complet pour les types de jour concernés.
export function buildOffer(rows, cols) {
    const subscriptions = {};
    const perRowDayTypes = new Map();
    for (const { kva, values } of rows) {
        subscriptions[kva] = values[0];
        const dayTypes = {};
        cols.forEach((paths, i) => {
            for (const p of paths) {
                const assertOnly = p.startsWith('=');
                const [type, field] = (assertOnly ? p.slice(1) : p).split('.');
                if (assertOnly) {
                    if (dayTypes[type]?.[field] !== values[1 + i]) {
                        throw new Error(`colonne "=${type}.${field}" : ${values[1 + i]} ≠ ${dayTypes[type]?.[field]} (${kva} kVA) — structure de grille à revoir`);
                    }
                    continue;
                }
                dayTypes[type] = dayTypes[type] || {};
                dayTypes[type][field] = values[1 + i];
            }
        });
        perRowDayTypes.set(kva, dayTypes);
    }

    const reference = perRowDayTypes.get(rows[rows.length - 1].kva);
    const priceOverrides = {};
    for (const { kva } of rows) {
        const dayTypes = perRowDayTypes.get(kva);
        const differing = Object.keys(dayTypes)
            .filter(type => JSON.stringify(dayTypes[type]) !== JSON.stringify(reference[type]));
        if (differing.length > 0) {
            priceOverrides[kva] = Object.fromEntries(differing.map(type => [type, dayTypes[type]]));
        }
    }

    const offer = { subscriptions, dayTypes: reference };
    if (Object.keys(priceOverrides).length > 0) offer.priceOverrides = priceOverrides;
    return offer;
}

// Pipeline commun aux grilles « colonnes HT/TTC doublées » (Total, Mint,
// Octopus, Alpiq) : configs[i] décrit le i-ème tableau détecté.
//   { offer, colCount, abo, prices: [[index, paths]] }
// abo/index pointent dans les colonnes numériques (0-based, kVA exclus) ;
// les prix sont des €/kWh convertis en centimes.
export function extractConfiguredOffers(doc, tables, configs, label, opts = {}) {
    if (tables.length !== configs.length) {
        throw new Error(`${label} : ${tables.length} tableau(x) kVA détecté(s), ${configs.length} attendu(s)`);
    }
    const offers = {};
    tables.forEach((table, i) => {
        const config = configs[i];
        const neighbor = tables
            .filter(t => t.page === table.page && t.kvaX > table.kvaX
                && t.yTop >= table.yBottom && t.yBottom <= table.yTop)
            .sort((a, b) => a.kvaX - b.kvaX)[0];
        const xMax = neighbor ? neighbor.kvaX - 10 : Infinity;

        const raw = extractTableValues(doc, table, xMax, config.colCount, `${label} / ${config.offer}`, opts);
        const rows = raw.map(({ kva, values }) => ({
            kva,
            values: [values[config.abo], ...config.prices.map(([index]) => euroPerKwhToCents(values[index]))],
        }));
        offers[config.offer] = buildOffer(rows, config.prices.map(([, paths]) => paths));
    });
    return offers;
}
