import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { parseFrNumber } from '../lib/fr-numbers.mjs';

function component(section, fields) {
    const rows = new Map();
    const charges = [];
    for (const line of section.split('\n')) {
        const cells = line.split('\t');
        if (/^\d+$/.test(cells[0]) && cells.length >= 3) {
            const annual = parseFrNumber(cells[2]);
            if (annual === null || rows.has(cells[0])) throw new Error('Abonnement annuel happ-e ambigu');
            rows.set(cells[0], annual);
        }
        const amounts = cells.filter(c => /^0,\d+$/.test(c));
        if (amounts.length) charges.push(...amounts);
    }
    if (charges.length !== fields * 2 || !/EUR\/an/.test(section) || !/TTC/.test(section)) throw new Error('Colonnes happ-e inattendues');
    return { rows, rates: charges.filter((_, i) => i % 2 === 1).map(parseFrNumber) };
}

export function parse(doc) {
    const [supply, cu, mu] = doc.pages.slice(0, 3).map(pageToText);
    const [baseText, hcText] = supply.split('COMPTAGE HEURES PLEINES / HEURES CREUSES');
    if (!hcText || !/happ\s*-\s*e 1 an/i.test(baseText) || !/COURTE UTILISATION/.test(cu)
        || !/2 PLAGES TEMPORELLES/.test(mu)) throw new Error('Grille happ-e 1 an attendue');
    const options = doc.pages.find(p => /Option VERTELEC\+ happ/i.test(pageToText(p)));
    if (!options || !/en €\/Mois/i.test(pageToText(options))) throw new Error('Option VertÉlec+ introuvable');
    const premium = new Map(buildLines(options.items).filter(l => /^\d+$/.test(l.cells[0]) && l.cells.length === 5)
        .map(({ cells }) => [cells[0], [parseFrNumber(cells[2]), parseFrNumber(cells[4])]]));
    const components = [
        [component(baseText, 1), component(cu.split('ACHEMINEMENT À 4 PLAGES')[0], 1)],
        [component(hcText.split('Choisir happ')[0], 2), component(mu.split('ACHEMINEMENT À 4 PLAGES')[0], 2)],
    ];
    const offers = {};
    for (const green of [false, true]) {
        const [base, hc] = components.map(([energy, network], option) =>
            [...energy.rows].map(([kva, annual]) => {
                const fee = premium.get(kva)?.[option];
                if (!network.rows.has(kva) || !Number.isFinite(fee)) throw new Error('Composante happ-e absente à ' + kva + ' kVA');
                const monthly = (annual + network.rows.get(kva)) / 12 + (green ? fee : 0);
                return gridRow(kva, Number(monthly.toFixed(8)), ...energy.rates.map((v, i) => v + network.rates[i]));
            }));
        Object.assign(offers, pairedOffers('Happ-e - Électricité 1 an' + (green ? ' VertÉlec+' : ''), base, hc));
    }
    return { gridDate: findNumericDate(supply), offers };
}
