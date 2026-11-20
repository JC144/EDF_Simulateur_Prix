// Grille La Bellenergie : un PDF unique, page 2 = trois blocs d'offres
// (Prudence 1 an, Constance 2 ans, Garance 3 ans), chacun avec deux
// tableaux côte à côte : OPTION BASE à gauche, OPTION HP-HC à droite.
// Les prix affichés sont HTT et TTC ; le repo stocke les TTC. Les prix
// barrés de comparaison au TRV sont suffixés "*" et donc ignorés par le
// parsing numérique.
import { buildLines } from '../lib/pdf-text.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';
import { findFrDate } from '../lib/dates.mjs';

export const provider = 'labelleenergie';

const OFFERS = [
    { title: 'Prudence', name: 'La Belle Energie - Prudence' },
    { title: 'Constance', name: 'La Belle Energie - Constance' },
    { title: 'Garance', name: 'La Belle Energie - Garance' },
];

const KVAS = new Set(['3', '6', '9', '12', '15', '18', '24', '30', '36']);
const X_SPLIT = 260; // séparation tableau BASE / tableau HP-HC

export function parse(doc) {
    const page = doc.pages[1];
    if (!page) throw new Error('page 2 (grilles) absente du PDF');
    const gridDate = findFrDate(doc.pages[0] ? pageText(doc.pages[0]) : '') || findFrDate(pageText(page));

    // Bornes verticales des trois blocs, repérées par leurs titres.
    const titles = OFFERS.map(o => {
        const item = page.items.find(it => it.str === o.title);
        if (!item) throw new Error(`titre d'offre "${o.title}" introuvable`);
        return { ...o, y: item.y };
    }).sort((a, b) => b.y - a.y);

    const offers = {};
    titles.forEach((offer, i) => {
        const yTop = offer.y - 1;
        const yBottom = i + 1 < titles.length ? titles[i + 1].y : -Infinity;
        const block = page.items.filter(it => it.y < yTop && it.y > yBottom);

        offers[offer.name] = parseBase(block, offer.title);
        offers[`${offer.name} HC`] = parseHpHc(block, offer.title);
    });

    return { gridDate, offers };
}

function pageText(page) {
    return buildLines(page.items).map(l => l.text).join('\n');
}

// Lignes d'abonnement : "kVA  HTT  TTC" -> { kva: TTC }
// Le rendu du PDF fait parfois dériver la cellule kVA de quelques points
// au-dessus de ses montants (ligne ["18"] puis ["24,40","32,59"]) : on
// apparie alors chaque kVA orphelin avec la ligne de montants orpheline
// la plus proche en dessous.
const ORPHAN_MAX_DRIFT = 8; // pts

function readSubscriptions(lines, label) {
    const rows = [];
    const orphanKvas = [];
    const orphanValues = [];
    for (const line of lines) {
        const hasKva = KVAS.has(line.cells[0]);
        // Les colonnes de prix du kWh peuvent partager la ligne HTT/TTC,
        // même lorsque la puissance est seule sur la ligne précédente.
        const start = hasKva ? 1 : 0;
        const amounts = line.cells.slice(start, start + 2).map(parseFrNumber);
        const complete = amounts.length === 2 && amounts.every(v => v !== null && v >= 1);
        if (hasKva) {
            if (complete) rows.push({ kva: line.cells[0], amounts });
            else orphanKvas.push({ kva: line.cells[0], y: line.y });
        } else if (complete) {
            orphanValues.push({ y: line.y, amounts, used: false });
        }
    }
    for (const orphan of orphanKvas) {
        const candidate = orphanValues
            .filter(v => !v.used && v.y < orphan.y && orphan.y - v.y <= ORPHAN_MAX_DRIFT)
            .sort((a, b) => b.y - a.y)[0];
        if (!candidate) throw new Error(`${label} : montants introuvables pour ${orphan.kva} kVA`);
        candidate.used = true;
        rows.push({ kva: orphan.kva, amounts: candidate.amounts });
    }

    const subscriptions = {};
    for (const { kva, amounts } of rows) {
        if (kva in subscriptions) throw new Error(`${label} : puissance ${kva} kVA en double`);
        subscriptions[kva] = amounts[1]; // [HTT, TTC] -> TTC
    }
    if (Object.keys(subscriptions).length === 0) throw new Error(`${label} : aucune ligne d'abonnement lue`);
    return subscriptions;
}

// Prix kWh non barrés d'une zone : items 0 < v < 1, groupés par ligne (y).
// Les prix barrés (comparaison TRV) sont suivis d'un item "*" accolé :
// on les écarte par adjacence.
function isStarred(it, stars) {
    return stars.some(s => Math.abs(s.y - it.y) < 2 && s.x - (it.x + it.w) >= -0.5 && s.x - (it.x + it.w) < 3);
}

function readKwhGroups(items, label) {
    const stars = items.filter(it => it.str === '*');
    const prices = items
        .filter(it => {
            const v = parseFrNumber(it.str);
            return v !== null && v > 0 && v < 1 && !isStarred(it, stars);
        })
        .sort((a, b) => b.y - a.y || a.x - b.x);
    const groups = [];
    let current = null;
    for (const it of prices) {
        if (!current || Math.abs(current.y - it.y) > 3) {
            current = { y: it.y, items: [] };
            groups.push(current);
        }
        current.items.push(it);
    }
    if (groups.length === 0) throw new Error(`${label} : aucun prix kWh lisible`);
    // L'ordre des colonnes (HTT, TTC, HP, HC...) est donné par X, pas par
    // l'ordre d'arrivée (les Y varient de quelques dixièmes dans une ligne).
    for (const g of groups) {
        g.values = g.items.sort((a, b) => a.x - b.x).map(it => parseFrNumber(it.str));
        delete g.items;
    }
    return groups;
}

function parseBase(block, title) {
    const items = block.filter(it => it.x < X_SPLIT);
    const label = `${title} (BASE)`;
    const subscriptions = readSubscriptions(buildLines(items), label);
    const groups = readKwhGroups(items, label);

    // Deux groupes [HTT, TTC] attendus : le premier (plus haut) s'applique
    // aux petites puissances 3 et 6 kVA (même découpage que le TRV), le
    // second à toutes les autres — structure constante de ces grilles.
    for (const g of groups) {
        if (g.values.length !== 2) throw new Error(`${label} : groupe de prix inattendu (${g.values.join(', ')})`);
    }
    if (groups.length === 1) {
        return { subscriptions, dayTypes: { bleu: { price: euroPerKwhToCents(groups[0].values[1]) } } };
    }
    if (groups.length !== 2) throw new Error(`${label} : ${groups.length} groupes de prix kWh, 1 ou 2 attendus`);
    const smallKvaPrice = euroPerKwhToCents(groups[0].values[1]);
    const basePrice = euroPerKwhToCents(groups[1].values[1]);
    const priceOverrides = {};
    for (const kva of ['3', '6']) {
        if (kva in subscriptions) priceOverrides[kva] = { bleu: { price: smallKvaPrice } };
    }
    return {
        subscriptions,
        dayTypes: { bleu: { price: basePrice } },
        priceOverrides,
    };
}

function parseHpHc(block, title) {
    const items = block.filter(it => it.x >= X_SPLIT);
    const label = `${title} (HP-HC)`;
    const subscriptions = readSubscriptions(buildLines(items), label);
    const groups = readKwhGroups(items, label);

    // Un seul groupe [HP HTT, HP TTC, HC HTT, HC TTC] attendu.
    if (groups.length !== 1 || groups[0].values.length !== 4) {
        throw new Error(`${label} : structure de prix kWh inattendue (${groups.map(g => g.values.join('/')).join(' ; ')})`);
    }
    const [, hpTtc, , hcTtc] = groups[0].values;
    return {
        subscriptions,
        dayTypes: { bleu: { HP: euroPerKwhToCents(hpTtc), HC: euroPerKwhToCents(hcTtc) } },
    };
}
