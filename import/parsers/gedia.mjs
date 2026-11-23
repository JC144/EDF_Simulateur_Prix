import { pageToText } from '../lib/pdf-text.mjs';
import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { parseFrNumber } from '../lib/fr-numbers.mjs';
import { findNumericDate } from '../lib/dates.mjs';

export function parse(doc) {
    const text = doc.pages.map(pageToText).find(t => /Prix de vente toutes taxes comprises/i.test(t));
    const section = text?.split(/OPTION Tarr?ifaire de base/i)[1];
    if (!section || !/Domestique/.test(section) || !/en €\s*\/an/.test(section)) throw new Error('Tableau domestique TTC Gedia absent');
    const base = [], hc = [];
    for (const line of section.split('\n')) {
        const cells = line.replace(/^Domestique\t/, '').split('\t');
        if (!/^\d+$/.test(cells[0])) continue;
        if (cells.length !== 6) throw new Error('Ligne Gedia incomplète');
        const [kva, sub, price, subHc, hp, hcPrice] = cells;
        const monthly = s => { const n = parseFrNumber(s); if (n === null) throw new Error('Abonnement annuel Gedia illisible'); return Number((n / 12).toFixed(8)); };
        base.push(gridRow(kva, monthly(sub), price));
        if (kva !== '3') hc.push(gridRow(kva, monthly(subHc), hp, hcPrice));
    }
    const date = /Prix applicables du (\d\d-\d\d-\d{4})/i.exec(text);
    if (!date) throw new Error('Période de souscription Gedia absente');
    return { gridDate: findNumericDate(date[1].replaceAll('-', '/')), offers: pairedOffers('Gedia - All Inclusive Électricité', base, hc) };
}
