import { findKvaTables, extractTableValues, buildOffer } from '../lib/table.mjs';
import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { findApplicableDate, findFrDate } from '../lib/dates.mjs';

import { discoverPdf } from '../lib/catalog-link.mjs';

export async function discoverUrl(current) {
    const url = new URL(current);
    if (url.hostname !== 'ohm-energie.com') return current;
    const prixReserve = /\/ELEC[-_]Prix[-_]Reserve\.pdf$/i;
    if (prixReserve.test(url.pathname)) {
        return discoverPdf('https://ohm-energie.com/prix-reserve-electricite-et-gaz', prixReserve);
    }
    const pattern = /weekend/i.test(url.pathname) ? /\/ELEC[-_]week[-_]?end[-_]fixe\.pdf$/i
        : new RegExp('/' + url.pathname.split('/').at(-1).replace(/\.pdf$/i, '\\.pdf$'), 'i');
    return discoverPdf('https://ohm-energie.com/offre/electricite', pattern);
}

export function parse(doc) {
    const first = pageToText(doc.pages[0]);
    const weekend = /OFFRE WEEK\s*-\s*END/i.test(first);
    const families = [[/OFFRE EXTRA ECO/i, 'Extra Eco'], [/OFFRE CLASSIQUE/i, 'Classique'],
        [/PREMI[’']OHM/i, 'Premi’Ohm'], [/SÉRÉNITÉ\s+FIXE 1 AN/i, 'Sérénité Fixe 1 an'],
        [/SÉRÉNITÉ\s+FIXE 2 ANS/i, 'Sérénité Fixe 2 ans'], [/OHM Prix Réservé/i, 'Prix Réservé']];
    const family = families.find(([title]) => title.test(first))?.[1];
    if (!family && !weekend) throw new Error('Grille OHM inconnue');
    // La couverture Prix Réservé annonce les dates d’activation avant la date de la grille.
    const gridDate = family === 'Prix Réservé' ? findApplicableDate(buildLines(doc.pages[0].items)) : findFrDate(first);
    if (family === 'Prix Réservé' && !gridDate) throw new Error('Date de grille OHM Prix Réservé introuvable');
    const offers = {};
    for (const [index, option] of (weekend ? ['Week-end'] : ['Base', 'HP/HC']).entries()) {
        const page = { pages: [doc.pages[index + 1]] };
        if (!/cts|centimes/i.test(pageToText(page.pages[0]))) throw new Error('Unité du kWh OHM à vérifier');
        const tables = findKvaTables(page);
        if (tables.length !== 1) throw new Error('Tableau OHM manquant : ' + option);
        const cols = weekend ? [3, 5, 7] : index === 0 ? [3] : [3, 5];
        const fields = weekend ? [['bleu.HP'], ['bleu.HC'], ['weekend.HP', 'weekend.HC']] : index === 0 ? [['bleu.price']] : [['bleu.HP'], ['bleu.HC']];
        const rows = extractTableValues(page, tables[0], Infinity, weekend ? 8 : index === 0 ? 4 : 6, option);
        offers[weekend ? 'OHM Énergie - Week-end' : 'OHM Énergie - ' + family + ' - ' + option] = buildOffer(rows.map(({ kva, values }) =>
            ({ kva, values: [values[1], ...cols.map(k => values[k])] })), fields);
    }
    return { gridDate, offers };
}
