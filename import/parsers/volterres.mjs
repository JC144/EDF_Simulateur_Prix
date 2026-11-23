import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { bestPartition, buildOffer } from '../lib/table.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';

export function parse(doc) {
    const page = doc.pages[0];
    const text = pageToText(page);
    if (!/Prix identiques aux tarifs réglementés/i.test(text)) throw new Error('Indexation Volterres à vérifier');
    const all = buildLines(page.items);
    const divider = all.findIndex(line => /Option tarifaire heures pleines/i.test(line.text));
    if (divider < 0) throw new Error('Option HP/HC Volterres absente');
    const kvaRows = lines => lines.filter(line => /^\d+ kVA$/.test(line.cells[0]));
    const base = all.slice(0, divider);
    const subscriptions = kvaRows(base);
    const prices = base.filter(line => /^0,\d+\t/.test(line.text));
    if (subscriptions.length !== 9 || !prices.length || prices.some(line => line.cells.length !== 3 || line.cells[1] !== line.cells[2])) {
        throw new Error('Tableau Base Volterres incomplet');
    }
    const sizes = bestPartition(subscriptions.map(row => row.y), prices.map(row => row.y));
    const kwh = prices.flatMap((line, i) => Array(sizes[i]).fill(euroPerKwhToCents(parseFrNumber(line.cells[1]))));
    const offers = { 'Volterres - Mon producteur (riverains) - Base': buildOffer(subscriptions.map((row, i) => {
        if (row.cells[2] !== row.cells[3] || parseFrNumber(row.cells[2]) === null) throw new Error('Abonnement Base Volterres ambigu');
        return { kva: row.cells[0].split(' ')[0], values: [parseFrNumber(row.cells[2]), kwh[i]] };
    }), [['bleu.price']]) };
    const lines = all.slice(divider);
    const bands = lines.filter(line => /^0,\d+\t/.test(line.text)).map(line => line.cells.map(parseFrNumber));
    if (bands.length !== 2 || bands.some(row => row.length !== 3 || row.includes(null))) throw new Error('Prix Volterres illisibles');
    // La grille d’août répète les deux TTC sur les deux lignes. Le différentiel HT
    // et la TVA imprimée permettent de vérifier quel TTC correspond aux HC.
    const [[htHP, hp, referenceHP], [htHC, hcPrinted, referenceHC]] = bands;
    const hc = hp === hcPrinted && referenceHP === referenceHC ? referenceHC : hcPrinted;
    if (!/TVA[^\n]*20\s*%/i.test(text) || Math.abs(hp - hc - (htHP - htHC) * 1.2) > 0.0002) {
        throw new Error('Tarifs HP et HC Volterres ambigus');
    }
    const rows = lines.filter(line => /^\d+ kVA$/.test(line.cells[0])).map(({ cells }) => {
        const monthly = parseFrNumber(cells[2]);
        if (monthly === null || monthly !== parseFrNumber(cells[3])) throw new Error('Abonnement Volterres ambigu');
        return { kva: cells[0].split(' ')[0], values: [monthly, euroPerKwhToCents(hp), euroPerKwhToCents(hc)] };
    });
    if (rows.length !== 8) throw new Error('Abonnements Volterres incomplets');
    offers['Volterres - Mon producteur (riverains) - HP/HC'] = buildOffer(rows, [['bleu.HP'], ['bleu.HC']]);
    return { gridDate: findFrDate(text), offers };
}
