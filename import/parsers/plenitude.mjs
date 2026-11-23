import { buildOffer } from '../lib/table.mjs';
import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';
import { isSubscriptionDisabled } from '../lib/subscriptions.mjs';

function offerName(text) {
    const family = text.match(/Offre de fourniture d'électricité (Plenifix 2 ans|Plenifix 1 an|Pleniweb 1 an)/i)?.[1];
    if (!family) throw new Error('Grille Plenitude inconnue');
    return 'Plenitude - ' + (/2 ans/i.test(family) ? 'Plenifix 2 ans (souscription août 2026)' : family);
}

export function subscriptionCheck() {
    return (doc, today) => {
        const text = pageToText(doc.pages[0]);
        const end = /pour toute souscription du \d{2}\/\d{2}\/\d{4}\s+au\s+(\d{2}\/\d{2}\/\d{4})\s+(non inclus|inclus)\b/i.exec(text);
        if (!end) return [];
        const date = findNumericDate(end[1]);
        const name = offerName(text);
        const reason = `Fin de souscription à cette grille le ${end[1]} (${end[2]})`;
        const rule = { names: [name + ' - Base', name + ' - HP/HC'], kind: 'expired', reason,
            endDate: date, endInclusive: end[2].toLowerCase() === 'inclus' };
        // Sans date, l'import conserve aussi les échéances à venir pour le bilan hors ligne.
        return !today || isSubscriptionDisabled(rule, today) ? [rule] : [];
    };
}

export function parse(doc) {
    const page = doc.pages[0];
    const text = pageToText(page);
    const name = offerName(text);
    if (!/€\/an/.test(text)) throw new Error('Grille Plenitude inconnue');
    const historical = /2 ans/i.test(name);
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
