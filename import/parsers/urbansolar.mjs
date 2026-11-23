import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { discoverPdf } from '../lib/catalog-link.mjs';

export const discoverUrl = () => discoverPdf('https://www.urbansolarenergy.fr/tarifs/', /\/TARIFS-SMB-PARTICULIERS-[^/]+\.pdf$/i);

export function parse(doc) {
    const text = pageToText(doc.pages[0]);
    if (!/OPTION DE BASE/.test(text) || !/pleines\s+creuses/i.test(text) || !/€\/mois TTC/.test(text)) throw new Error('Grille Essentielle SMB inattendue');
    const lines = buildLines(doc.pages[0].items);
    const rates = lines.find(l => l.cells.length === 3 && l.cells.every(c => /^\d+[.,]\d+\s+TTC\s+\(5\)$/.test(c)))?.cells.map(s => s.split(/\s/)[0]);
    if (!rates) throw new Error('Trois prix TTC attendus');
    const base = [], hc = [];
    for (const { cells } of lines.filter(l => /^\d+$/.test(l.cells[0]))) {
        const [kva,, baseSub,, hcSub] = cells;
        if (cells.length !== (kva === '3' ? 3 : 5)) throw new Error('Abonnement Essentielle SMB illisible');
        base.push(gridRow(kva, baseSub, rates[0]));
        if (hcSub) hc.push(gridRow(kva, hcSub, rates[1], rates[2]));
    }
    return { gridDate: findNumericDate(text), offers: pairedOffers('Urban Solar Energy - Essentielle SMB', base, hc) };
}
