import { buildOffer } from '../lib/table.mjs';
import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';

export function parse(doc) {
    const page = doc.pages[0];
    const text = pageToText(page);
    const family = text.match(/Offre de fourniture d'électricité (Plenifix 2 ans|Plenifix 1 an|Pleniweb 1 an)/i)?.[1];
    if (!family || !/€\/an/.test(text)) throw new Error('Grille Plenitude inconnue');
    const historical = /2 ans/i.test(family);
    const name = 'Plenitude - ' + (historical ? 'Plenifix 2 ans (souscription août 2026)' : family);
    const base = [], hc = [];
    for (const { cells } of buildLines(page.items)) {
        const match = cells[0].match(/^(\d+) kVA$/i);
        if (!match) continue;
        const kva = match[1];
        const values = cells.slice(1).map(parseFrNumber);
        if (values.length !== (historical && kva === '3' ? 4 : 10) || values.includes(null)) throw new Error('Ligne Plenifix illisible : ' + kva);
        const monthly = index => Number((values[index] / 12).toFixed(8));
        base.push({ kva, values: [monthly(1), euroPerKwhToCents(values[3])] });
        if (values.length === 10) hc.push({ kva, values: [monthly(5), euroPerKwhToCents(values[7]), euroPerKwhToCents(values[9])] });
    }
    if (base.length !== 9 || hc.length !== (historical ? 8 : 9)) throw new Error('Puissances Plenifix incomplètes');
    return { gridDate: findNumericDate(text), offers: {
        [name + ' - Base']: buildOffer(base, [['bleu.price']]),
        [name + ' - HP/HC']: buildOffer(hc, [['bleu.HP'], ['bleu.HC']]),
    } };
}
