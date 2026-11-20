import { findNumericDate } from '../lib/dates.mjs';
import { euroPerKwhToCents, parseFrNumber } from '../lib/fr-numbers.mjs';
import { buildLines } from '../lib/pdf-text.mjs';
import { buildOffer, KVAS } from '../lib/table.mjs';

export const provider = 'alterna';

const STANDARD_OFFERS = {
    'Mon électricité française': ['Alterna - Base France', 'Alterna - Heures Creuses'],
    'Mon électricité du coin': ['Alterna - Base Locale', 'Alterna - Heures Creuses Locale'],
};
const SEASONAL_TITLE = 'Mon électricité Heures Super Creuses';
const SEASONAL_PRICES = ['hpHiver', 'hcHiver', 'hscHiver', 'hpEte', 'hcEte', 'hscEte'];
// « Heures super creuses » se poursuit sur la ligne suivante du PDF.
const PERIODS = ['Heures pleines', 'Heures creuses', 'Heures super'];
const SEASONAL_HEADER = ['Puissance souscrite', 'Abonnement', ...PERIODS, ...PERIODS].join('\t');
const TTC_HEADER = /^Tarifs TTC\s*[-–]\s*applicables au\b/i;

function readRows(lines, priceUnits) {
    const units = ['(en kVA)', ...priceUnits].join('\t');
    const index = lines.findIndex(line => line.text === units);
    if (index < 0) throw new Error('Alterna : unités ou ordre des colonnes TTC inattendus');

    const rows = [];
    for (const { cells } of lines.slice(index + 1)) {
        const [kva, ...amounts] = cells;
        if (!/^\d+$/.test(kva)) break;
        const values = amounts.map(parseFrNumber);
        if (values.length !== priceUnits.length || values.some(value => value === null)) {
            throw new Error(`Alterna : montants TTC incomplets pour ${kva} kVA`);
        }
        rows.push({ kva, values });
    }
    if (rows.map(r => r.kva).join(',') !== KVAS.join(',')) {
        throw new Error('Alterna : puissances du tableau TTC inattendues');
    }
    return rows;
}

export function parse(doc) {
    const pages = doc.pages.map(page => buildLines(page.items));
    const ttc = pages.filter(lines => lines.some(line => TTC_HEADER.test(line.text)));
    if (ttc.length !== 1) throw new Error('Alterna : page TTC absente ou ambiguë');
    const lines = ttc[0];
    const gridDate = findNumericDate(lines.find(line => TTC_HEADER.test(line.text)).text);
    if (!gridDate) throw new Error('Alterna : date de la grille TTC introuvable');

    const title = lines.find(l => l.text === SEASONAL_TITLE || Object.hasOwn(STANDARD_OFFERS, l.text))?.text;
    if (title === SEASONAL_TITLE) {
        if (!lines.some(l => l.text === 'Hiver\tÉté') || !lines.some(l => l.text === SEASONAL_HEADER)) {
            throw new Error('Alterna : ordre des saisons ou des périodes inattendu');
        }
        const rows = readRows(lines, ['(en €/mois)', ...Array(6).fill('(en €/kWh)')]);
        const offer = buildOffer(rows.map(({ kva, values: [subscription, ...prices] }) => ({
            kva, values: [subscription, ...prices.map(euroPerKwhToCents)],
        })), SEASONAL_PRICES.map(type => [type + '.price']));
        return { gridDate, offers: { 'Alterna - Heures Super Creuses': offer } };
    }

    const names = STANDARD_OFFERS[title];
    if (!names || !lines.some(l => l.text === 'Option Base\tOption Heures Creuses')) {
        throw new Error('Alterna : titre de l’offre ou options de la grille TTC inconnus');
    }
    const rows = readRows(lines, ['(en €/mois)', '(en €/kWh)', '(en €/mois)', 'H. Pleines', 'H. Creuses']);
    const base = [];
    const hc = [];
    for (const { kva, values: [baseSub, basePrice, hcSub, hpPrice, hcPrice] } of rows) {
        base.push({ kva, values: [baseSub, euroPerKwhToCents(basePrice)] });
        hc.push({ kva, values: [hcSub, euroPerKwhToCents(hpPrice), euroPerKwhToCents(hcPrice)] });
    }
    return { gridDate, offers: {
        [names[0]]: buildOffer(base, [['bleu.price']]),
        [names[1]]: buildOffer(hc, [['bleu.HP'], ['bleu.HC']]),
    } };
}
