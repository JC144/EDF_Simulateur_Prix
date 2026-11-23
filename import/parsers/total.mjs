// Grilles TotalEnergies : tableaux « N kVA » (toutes les puissances
// entières) avec colonnes doublées HT/TTC, et pour les offres indexées une
// double série TRV/Offre. Le repo stocke les TTC de l'offre ; on pointe
// donc les colonnes par index (0-based, kVA exclu).
import path from 'node:path';
import { findKvaTables, extractConfiguredOffers, buildOffer } from '../lib/table.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { gridRow } from '../lib/residential-grid.mjs';
import { pageToText } from '../lib/pdf-text.mjs';

export const provider = 'total';

const T = (offer, colCount, abo, prices) => ({ offer, colCount, abo, prices });

const CONFIGS = {
    'grille-tarifaire-heures-eco-plus-particuliers.pdf': [
        T('TotalEnergie - Heures Eco+ - Jours Éclair', 8, 1, [[3, ['bleu.HP', 'eclair.HP']], [5, ['bleu.HC', 'eclair.HC']], [7, ['vigilance.HP', 'vigilance.HC']]]),
    ],
    'grille-tarifaire-fixe-3ans-particuliers.pdf': [
        T('TotalEnergie - Fixe 3 ans - Base', 4, 1, [[3, ['bleu.price']]]),
        T('TotalEnergie - Fixe 3 ans - HP/HC', 6, 1, [[3, ['bleu.HP']], [5, ['bleu.HC']]]),
    ],
    // Indexée TRV : abo HT/TTC, puis TRV HT/TTC et Offre HT/TTC par cadran.
    'grille-tarifaire-heures-eco-particuliers.pdf': [
        T('TotalEnergie - Heures Eco', 6, 1, [[5, ['bleu.price']]]),
        T('TotalEnergie - HeuresEco HC', 10, 1, [[5, ['bleu.HP']], [9, ['bleu.HC']]]),
    ],
    // Fixes : abo HT/TTC puis Offre HT/TTC par cadran.
    'grille-tarifaire-standard-fixe-particuliers.pdf': [
        T('TotalEnergie - Offre standard fixe', 4, 1, [[3, ['bleu.price']]]),
        T('TotalEnergie - Offre standard fixe HC', 6, 1, [[3, ['bleu.HP']], [5, ['bleu.HC']]]),
    ],
    'grille-tarifaire-verte-fixe-particuliers.pdf': [
        T('TotalEnergie - Offre verte fixe', 4, 1, [[3, ['bleu.price']]]),
        T('TotalEnergie - Offre verte fixe HC', 6, 1, [[3, ['bleu.HP']], [5, ['bleu.HC']]]),
    ],
    'grille-tarifaire-charge-heures-particuliers.pdf': [
        T("TotalEnergie - Charge'Heures", 8, 1, [[3, ['base.HP']], [5, ['base.HC']], [7, ['hsc.price']]]),
    ],
};

export function parse(doc, url) {
    const basename = path.basename(new URL(url).pathname);
    if (basename === 'grille-tarifaire-access-particuliers.pdf') {
        const text = pageToText(doc.pages[0]);
        if (!/Offre Access/.test(text) || !/prix HT remisés/i.test(text)) throw new Error('Tableaux Access remisés attendus');
        const base = [], hc = [];
        for (const line of text.split('\n').filter(l => /^\d+ kVA\t/.test(l))) {
            // Les colonnes de comparaison TRV peuvent être fusionnées. La
            // dernière paire de chaque bloc (Base, HP, HC) est le prix remisé.
            const blocks = [...line.matchAll(/(\d+) kVA\t(.*?)(?=\t\d+ kVA\t|$)/g)];
            for (const [column, [, kva, cells]] of blocks.entries()) {
                const n = cells.trim().split(/\s+/);
                const expected = column === 0 ? 6 : 10;
                if (n.length !== expected || Number(kva) !== (column ? hc.length + 6 : base.length + 3)) throw new Error('Ligne Access illisible : ' + kva);
                if (column === 0) base.push(gridRow(kva, n[1], n[5]));
                else hc.push(gridRow(kva, n[1], n[5], n[9]));
            }
        }
        if (base.length !== 34 || hc.length !== 31) throw new Error('Puissances Access manquantes');
        return { gridDate: findFrDate(text), offers: {
            'TotalEnergie - Access - Base': buildOffer(base, [['bleu.price']]),
            'TotalEnergie - Access - HP/HC': buildOffer(hc, [['bleu.HP'], ['bleu.HC']]),
        } };
    }
    const configs = CONFIGS[basename];
    if (!configs) throw new Error(`PDF TotalEnergies non configuré : ${basename}`);

    // Les pages suivantes concernent le gaz : seule la page 1 (électricité)
    // nous intéresse.
    const tables = findKvaTables({ pages: [doc.pages[0]] });
    const offers = extractConfiguredOffers(doc, tables, configs, basename);
    return { gridDate: findFrDate(pageToText(doc.pages[0])), offers };
}
