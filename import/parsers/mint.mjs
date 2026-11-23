// Grilles Mint Energie : page 1, deux tableaux côte à côte (Base / HP-HC),
// abonnement HTT/TTC par ligne et prix kWh en cellules fusionnées HTT/TTC.
// Le repo stocke les TTC.
import path from 'node:path';
import { findKvaTables, extractConfiguredOffers } from '../lib/table.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { pageToText } from '../lib/pdf-text.mjs';

export const provider = 'mint';

const T = (offer, colCount, abo, prices) => ({ offer, colCount, abo, prices });

const families = { CLASSIC: 'Classic', ONLINE: 'Online', SMART: 'Smart' };

export function parse(doc, url) {
    const basename = path.basename(new URL(url).pathname);
    const family = basename.match(/^MINT_ENERGIE_Fiche_Tarifs_\d+_(CLASSIC|ONLINE|SMART)_GREEN\.pdf$/i)?.[1].toUpperCase();
    if (!family) throw new Error(`PDF Mint non configuré : ${basename}`);
    const name = 'Mint Energie - ' + families[family] + ' & Green';
    const configs = [
        T(name, 4, 1, [[3, ['bleu.price']]]),
        T(name + ' HC', 6, 1, [[3, ['bleu.HP']], [5, ['bleu.HC']]]),
    ];

    // Page 1 = grille ; pages suivantes = fiche descriptive.
    const tables = findKvaTables({ pages: [doc.pages[0]] });
    const offers = extractConfiguredOffers(doc, tables, configs, basename);
    return { gridDate: findNumericDate(pageToText(doc.pages[0])), offers };
}
