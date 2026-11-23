// Fiche Elec Référence 3 ans. Les montants TTC sont publiés séparément
// pour la fourniture, l'acheminement et les obligations à la souscription.
import { buildLines } from '../lib/pdf-text.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';
import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { buildOffer, KVAS } from '../lib/table.mjs';

export const provider = 'engie';

function section(pages, from, until) {
    for (const page of pages) {
        const lines = buildLines(page.items);
        const title = lines.find(l => from.test(l.text));
        if (!title) continue;
        const end = lines.find(l => l.y < title.y && until.test(l.text));
        if (end) return page.items.filter(it => it.y < title.y - 2.5 && it.y > end.y + 2.5);
    }
    throw new Error(`tableau Engie introuvable : ${from}`);
}

// Les deux colonnes de puissance commencent à 3 kVA, même pour l'option
// HP/HC dont la première ligne contient uniquement des tirets.
function splitTables(items) {
    const anchors = items.filter(it => it.str === '3').sort((a, b) => a.x - b.x);
    if (anchors.length !== 2) throw new Error('Engie : deux tableaux côte à côte attendus');
    const split = anchors[1].x - 8;
    return [items.filter(it => it.x < split), items.filter(it => it.x >= split)];
}

function ttcRows(items, pairs, label, noThree = false) {
    const lines = buildLines(items);
    const headers = lines.flatMap(l => l.cells).filter(c => /^(HTT|TTC\*?)$/.test(c));
    if (headers.map(c => c.replace('*', '')).join(' ') !== Array(pairs).fill('HTT TTC').join(' ')) {
        throw new Error(`Engie : colonnes HTT/TTC inattendues (${label})`);
    }
    const rows = {};
    for (const kva of KVAS) {
        const anchors = items.filter(it => it.str === kva);
        if (anchors.length !== 1) throw new Error(`Engie : ligne ${kva} kVA ambiguë ou absente (${label})`);
        const [anchor] = anchors;
        const values = items.filter(it => it.x > anchor.x + anchor.w && Math.abs(it.y - anchor.y) < 6)
            .sort((a, b) => a.x - b.x).map(it => it.str);
        if (noThree && kva === '3' && values.length === pairs * 2 && values.every(v => v === '-')) continue;
        const numbers = values.map(parseFrNumber);
        if (numbers.length !== pairs * 2 || numbers.some(n => n === null || n < 0)) {
            throw new Error(`Engie : montants incomplets pour ${kva} kVA (${label})`);
        }
        rows[kva] = numbers.filter((_, i) => i % 2 === 1);
    }
    return rows;
}

function combine(supply, network, obligations, fields) {
    const rows = Object.entries(supply).map(([kva, [annual, ...prices]]) => {
        const delivery = network[kva];
        const obligation = obligations[kva]?.[0]; // prix à la souscription, avant le prix maximal
        if (!delivery || obligation === undefined) throw new Error(`Engie : composante absente à ${kva} kVA`);
        const monthly = Number(((annual + delivery[0]) / 12).toFixed(10));
        const cents = prices.map((price, i) => euroPerKwhToCents(price + delivery[i + 1] + obligation));
        return { kva, values: [monthly, ...cents] };
    });
    return buildOffer(rows, fields);
}

function obligationRows(items, label, noThree = false) {
    if (!buildLines(items).some(l => /prix par kWh à la.*prix par kWh maximal/i.test(l.text))) {
        throw new Error(`Engie : colonnes de souscription et de plafond inattendues (${label})`);
    }
    return ttcRows(items, 2, label, noThree);
}

function parseRetailGrid(page, gridDate, car) {
    const lines = buildLines(page.items);
    const pairs = car ? 3 : 5;
    if (!lines.some(l => l.text === Array(pairs).fill('HTT\tTTC*').join('\t'))
        || !lines.some(l => l.text.includes('EUR/an')) || !lines.some(l => l.text.includes('Heures Pleines\tHeures Creuses'))) {
        throw new Error('Abonnement annuel ou colonnes TTC ENGIE modifiés');
    }
    const base = [], hc = [];
    for (const { cells } of lines.filter(l => KVAS.includes(l.cells[0]) && l.cells.length > 1)) {
        if (cells.length !== 1 + 2 * pairs) throw new Error('Ligne ENGIE incomplète');
        const monthly = index => {
            const n = parseFrNumber(cells[index]);
            if (n === null) throw new Error('Abonnement ENGIE absent');
            return Number((n / 12).toFixed(8));
        };
        if (!car) base.push(gridRow(cells[0], monthly(2), cells[4]));
        if (cells[0] !== '3') hc.push(car ? gridRow(cells[0], monthly(2), cells[4], cells[6])
            : gridRow(cells[0], monthly(6), cells[8], cells[10]));
    }
    if (hc.map(r => r.kva).join() !== KVAS.slice(1).join()) throw new Error('Puissances HP/HC ENGIE incomplètes');
    const offers = car ? { 'Engie - Élec’Car 1 an (hors bonus de pilotage) - HP/HC': buildOffer(hc, [['bleu.HP'], ['bleu.HC']]) }
        : pairedOffers('Engie - Élec Adapt 1 an', base, hc);
    return { gridDate, offers };
}

export function parse({ pages }) {
    const heading = pages.flatMap(p => buildLines(p.items)).find(l => /^Grille tarifaire\s*-/i.test(l.text));
    // La fiche date sa grille au mois, sans préciser de jour.
    const gridDate = heading && findFrDate('1 ' + heading.text.split('-').at(-1).trim());
    if (!gridDate) throw new Error('Engie : mois de la grille tarifaire introuvable');
    const retail = pages.find(p => {
        const lines = buildLines(p.items);
        return lines.some(l => /^Grille tarifaire/i.test(l.text)) && lines.some(l => /^Elec(?: Adapt|[’']Car) 1 an$/i.test(l.text));
    });
    if (retail) {
        return parseRetailGrid(retail, gridDate, buildLines(retail.items).some(l => /Elec[’']Car 1 an/i.test(l.text)));
    }
    const [cs, hphc] = splitTables(section(pages, /^Fourniture comptage simple.*HP\/HC/, /\(CU\)$/));
    const cu = section(pages, /Acheminement.*\(CU\)$/, /\(CU4\)$/);
    const mudt = section(pages, /Acheminement.*\(MUDT\)$/, /\(MU4\)$/);
    const [obBase, obHc] = splitTables(section(pages, /^Obligation comptage simple.*Obligation Heures/, /^\*\s*Prix/i));
    const base = combine(ttcRows(cs, 2, 'fourniture CS'), ttcRows(cu, 2, 'CU'),
        obligationRows(obBase, 'obligation CS'), [['bleu.price']]);
    const hc = combine(ttcRows(hphc, 3, 'fourniture HP/HC', true), ttcRows(mudt, 3, 'MUDT'),
        obligationRows(obHc, 'obligation HP/HC', true), [['bleu.HP'], ['bleu.HC']]);
    return { gridDate, offers: { 'Engie - Elec Référence 3 ans': base, 'Engie - Elec Référence 3 ans HC': hc } };
}
