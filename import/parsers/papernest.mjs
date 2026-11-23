import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { findNumericDate } from '../lib/dates.mjs';

export function parse(doc) {
    const text = pageToText(doc.pages[0]);
    if (!/papernest energie/i.test(text) || !/Abonnement mensuel TTC/.test(text)
        || !/Heures Pleines\s+Heures Creuses/i.test(text)) throw new Error('En-tête TTC papernest modifié');
    const base = [], hc = [];
    for (const { cells } of buildLines(doc.pages[0].items)) {
        if (!/^\d+$/.test(cells[0])) continue;
        if (![3, 4].includes(cells.length)) throw new Error('Ligne papernest incomplète');
        (cells.length === 3 ? base : hc).push(gridRow(...cells));
    }
    return { gridDate: findNumericDate(text), offers: pairedOffers('Papernest Énergie - Électricité 100 % renouvelable', base, hc) };
}
