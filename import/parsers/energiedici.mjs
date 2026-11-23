import { buildOffer } from '../lib/table.mjs';
import { buildLines } from '../lib/pdf-text.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { parseFrNumber } from '../lib/fr-numbers.mjs';

export function parse(doc) {
    const lines = buildLines(doc.pages[0].items);
    const gridDate = findFrDate(lines.find(line => /applicables à partir/i.test(line.text))?.text || '');
    const labels = ['HPH', 'HCH', 'HPB', 'HCB'];
    const columns = labels.map(label => lines.flatMap(line => line.spans)
        .filter(span => span.text.startsWith(label + ' :'))
        .sort((a, b) => a.x0 - b.x0)
        .map(span => parseFrNumber(span.text.split(':')[1])));
    if (!gridDate || columns.some(pair => pair.length !== 2 || pair.includes(null))) throw new Error('Grille CU4 / MU4 illisible');
    const rows = lines.filter(line => /^(3|6|9|12|15|18|24|30|36)$/.test(line.cells[0])).map(line => {
        const subs = line.cells.slice(1).map(parseFrNumber).filter(n => n !== null);
        if (subs.length !== 2) throw new Error('Abonnements CU4 / MU4 illisibles : ' + line.text);
        return { kva: line.cells[0], subs };
    });
    if (new Set(rows.map(r => r.kva)).size !== 9 || rows.length !== 9) throw new Error('Puissances CU4 / MU4 incomplètes');
    const offers = {};
    for (const [i, option] of ['Base (CU4)', 'Heures Creuses (MU4)'].entries()) {
        offers['Énergie d’ici - Énergie Bleue - ' + option] = buildOffer(
            rows.map(({ kva, subs }) => ({ kva, values: [subs[i], ...columns.map(pair => pair[i])] })),
            [['hiver.HP'], ['hiver.HC'], ['ete.HP'], ['ete.HC']]);
    }
    return { gridDate, offers };
}
