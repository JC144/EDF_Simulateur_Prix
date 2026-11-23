import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { buildOffer } from '../lib/table.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';

function standardGrid(text) {
    const range = text.match(/Disponible du (\d{1,2}) au \d{1,2} ([\p{L}]+ \d{4})/u);
    const [, baseText, hcText] = text.split(/OPTION TARIFAIRE (?:DE BASE|HEURES PLEINES \/ HEURES CREUSES)/);
    if (!range || !baseText || !hcText || ![baseText, hcText].every(t => t.includes('TARIFS HT\tTARIFS TTC'))) throw new Error('Grille ÉnRFixe+ inattendue');
    const rows = t => t.split('\n').filter(l => /^\d+ kVA\t/.test(l)).map(l => l.replace(' kVA\t', '\t').split('\t'));
    const base = rows(baseText).map(c => {
        if (c.length !== 5) throw new Error('Abonnement ou prix Base ilek manquant');
        return gridRow(c[0], c[3], c[4]);
    });
    const lines = rows(hcText);
    const energy = [];
    let period;
    const subs = [];
    for (const cells of lines) {
        if (![3, 5].includes(cells.length)) throw new Error('Colonnes HP/HC ilek inattendues');
        subs.push([cells[0], cells.length === 3 ? cells[2] : cells[3]]);
        if (cells.length === 5) {
            if (/^Heures (creuses|pleines)$/i.test(cells[4])) period = cells[4].toLowerCase();
            else if (period) { energy.push([period, cells[4]]); period = undefined; }
            else throw new Error('Prix ilek sans plage horaire');
        }
    }
    if (energy.map(e => e[0]).join(',') !== 'heures creuses,heures pleines') throw new Error('Périodes ilek non reconnues');
    const hc = subs.map(([kva, sub]) => gridRow(kva, sub, energy[1][1], energy[0][1]));
    return { gridDate: findFrDate(range[1] + ' ' + range[2]), offers: pairedOffers('ilek - ÉnRFixe+', base, hc) };
}

export function parse(doc) {
    const text = pageToText(doc.pages[0]);
    if (/Offre ÉnRFixe\+/.test(text)) return standardGrid(text);
    const lines = buildLines(doc.pages[0].items);
    const bottom = lines.findIndex(line => line.text.startsWith('TARIFS DE BASE'));
    const grid = lines.slice(0, bottom);
    const compact = grid.map(line => line.text.replace(/\s/g, '').toLowerCase()).join(' ');
    if (bottom < 0 || !compact.includes('de3h01à7h00') || !compact.includes('de1h01à3h00&13h01à15h')) throw new Error('Plages ilek modifiées');
    const header = grid.find(line => line.cells.filter(cell => cell === 'Abonnement mensuel').length === 2);
    if (header?.spans.length !== 4 || !compact.includes('tarifshttarifsttc')) throw new Error('Colonnes HT / TTC ilek illisibles');
    const subX = header.spans[2].x0;
    const priceX = (header.spans[2].x1 + header.spans[3].x0) / 2;
    const ttc = grid.filter(line => line.y < header.y);
    const prices = ttc.flatMap(line => line.spans.filter(span => span.x0 >= priceX))
        .map(span => span.text.replace(/\s/g, '').toLowerCase());
    const labels = ['superheurescreuses', 'heurescreuses', 'heurespleines'];
    const cents = labels.map((label, i) => {
        const n = parseFrNumber(prices[i * 2 + 1]);
        if (prices[i * 2] !== label || n === null) throw new Error('Prix TTC ilek illisible : ' + label);
        return euroPerKwhToCents(n);
    });
    const rows = ttc.filter(line => /^\d+kva$/i.test(line.cells[0].replace(/\s/g, ''))).map(line => {
        const subs = line.spans.filter(s => s.x0 >= subX && s.x0 < priceX);
        const monthly = parseFrNumber(subs[0]?.text);
        if (subs.length !== 1 || monthly === null) throw new Error('Abonnement TTC ilek inconnu');
        return { kva: line.cells[0].replace(/\D/g, ''), values: [monthly, ...cents] };
    });
    if (rows.length !== 8 || prices.length !== 6) throw new Error('Grille ilek incomplète');
    return { gridDate: findFrDate(grid.map(line => line.text).join('\n')), offers: {
        'ilek - Voiture électrique': buildOffer(rows, [['hsc.price'], ['bleu.HC'], ['bleu.HP']]),
    } };
}
