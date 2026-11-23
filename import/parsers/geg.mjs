import { pageToText } from '../lib/pdf-text.mjs';
import { gridRow, pairedOffers } from '../lib/residential-grid.mjs';
import { findFrDate } from '../lib/dates.mjs';

import { discoverPdf } from '../lib/catalog-link.mjs';

export function discoverUrl(current) {
    const isBlue = /Bleue/i.test(decodeURIComponent(new URL(current).pathname));
    const pattern = isBlue ? /\/Grille-tarifaire-[^/]+Bleue[^/]*\.pdf$/i
        : /\/Grille-tarifaire-Mes%20Offres%20Elec%20fixes%203%20ans[^/]*\.pdf$/i;
    return discoverPdf('https://www.geg.fr/aide-et-contact/centre-documentation/particulier/tarifs/', pattern,
        { before: /Historique des tarifs en \d{4}/i });
}

function tarifBleu(text) {
    const section = text.split('Tarif Bleu Électricité EJP')[0];
    const date = findFrDate(section);
    const shared = section.match(/^0,\d+\t(0,\d+)$/m);
    if (!date || !shared || !/TTC \/mois/.test(section) || !/extinction/i.test(section)) throw new Error('Grille réglementée GEG inattendue');
    const base = [], hc = [];
    for (const line of section.split('\n')) {
        const cells = line.split('\t');
        if (!/^\d+( \*)?$/.test(cells[0])) continue;
        const kva = cells[0].replace(' *', '');
        const merged = cells[0].endsWith('*');
        if (cells.length !== (merged ? 9 : 11)) throw new Error('Ligne GEG Tarif Bleu illisible');
        base.push(gridRow(kva, cells[3], merged ? shared[1] : cells[8]));
        hc.push(gridRow(kva, cells[4], cells.at(-1), cells.at(-2)));
    }
    if (hc[0]?.kva !== '3') throw new Error('Ligne 3 kVA réglementée absente');
    const name = 'GEG - Tarif Bleu (zone GEG)';
    const offers = pairedOffers(name, base, hc.slice(1));
    offers[name + ' - HP/HC'].subscriptions[3] = hc[0].values[0];
    if (hc[0].values[1] !== hc[1].values[1] || hc[0].values[2] !== hc[1].values[2]) throw new Error('Tarif spécifique 3 kVA GEG à traiter');
    return { gridDate: date, offers };
}

export function parse(doc) {
    const text = pageToText(doc.pages[0]);
    if (text.startsWith('Tarif Bleu')) return tarifBleu(text);
    const sections = text.split(/Mon Offre Elec Verte (Direct Producteur )?- fixe 3 ans Clients Particuliers/i);
    if (sections.length !== 5) throw new Error('Les deux offres GEG pour particuliers sont attendues');
    const offers = {};
    let gridDate;
    for (const index of [2, 4]) {
        const section = sections[index];
        const date = findFrDate(section);
        if (!date || (gridDate && gridDate !== date) || !/Part énergie en € TTC/.test(section)) throw new Error('Date ou colonnes TTC GEG modifiées');
        gridDate = date;
        const base = [], hc = [];
        for (const line of section.split('\n')) {
            const cells = line.split('\t');
            if (!/^\d+$/.test(cells[0])) continue;
            if (cells.length !== 11) throw new Error('Ligne GEG incomplète');
            const [kva, , , sub, subHc, , , , rate, hcRate, hpRate] = cells;
            base.push(gridRow(kva, sub, rate));
            if (kva !== '3') hc.push(gridRow(kva, subHc, hpRate, hcRate));
        }
        const name = sections[index - 1] ? 'GEG - Élec Verte Direct Producteur fixe 3 ans' : 'GEG - Élec Verte fixe 3 ans';
        Object.assign(offers, pairedOffers(name, base, hc));
    }
    return { gridDate, offers };
}
