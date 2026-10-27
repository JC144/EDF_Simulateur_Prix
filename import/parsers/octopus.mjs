// Grilles Octopus Energy : un tableau par page (kVA 1 à 36), prix kWh en
// cellules fusionnées ; page 2 = prix HTT, page 3 = prix TTC (celle que le
// repo modélise). OctoSaisons (ex-OctoTempo) : 6 cadrans hiver/été/jours
// rouges, prix unique pour toutes les puissances. Eco-fixe Base / HPHC :
// HP et HC hiver/été, trois paliers de prix (3 kVA, 6 kVA, 9 à 36 kVA).
// L'offre est reconnue au titre de la page 1 : les URL Octopus changent à
// chaque nouvelle grille (ex. « ...-aout-26-base.pdf »).
import { findKvaTables, extractConfiguredOffers } from '../lib/table.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { pageToText } from '../lib/pdf-text.mjs';

export const provider = 'octopus';

const T = (offer, colCount, abo, prices) => ({ offer, colCount, abo, prices });

// title : motif du titre « Offre d’électricité - <offre> » de la page 1 ;
// pages : indices (0-based) des pages contenant les tableaux à extraire,
// dans l'ordre des configs.
const CONFIGS = [
    {
        title: /OctoSaisons/i,
        pages: [2],
        tables: [
            T('Octopus - OctoSaisons', 7, 0, [
                [1, ['hiver.HP']], [2, ['hiver.HC']],
                [3, ['ete.HP']], [4, ['ete.HC']],
                [5, ['rouge.HP']], [6, ['rouge.HC']],
            ]),
        ],
    },
    {
        title: /Eco[\s-]?fixe\s+Base/i,
        pages: [2],
        tables: [
            // HP = HC : les colonnes HC ne servent qu'à le vérifier.
            T('Octopus - Eco-fixe Base', 5, 0, [
                [1, ['hiver.price']], [2, ['=hiver.price']],
                [3, ['ete.price']], [4, ['=ete.price']],
            ]),
        ],
    },
    {
        title: /Eco[\s-]?fixe\s+HP\s*HC/i,
        pages: [2],
        tables: [
            T('Octopus - Eco-fixe Heures Creuses', 5, 0, [
                [1, ['hiver.HP']], [2, ['hiver.HC']],
                [3, ['ete.HP']], [4, ['ete.HC']],
            ]),
        ],
    },
];

export function parse(doc, url) {
    const firstPage = pageToText(doc.pages[0]);
    const title = firstPage.match(/Offre d.électricité\s*-\s*(.+)/)?.[1].trim() ?? '';
    const config = CONFIGS.find(c => c.title.test(title));
    if (!config) throw new Error(`PDF Octopus non configuré : titre « ${title} » (${url})`);

    const subDoc = { pages: config.pages.map(i => doc.pages[i]) };
    const tables = findKvaTables(subDoc);
    const offers = extractConfiguredOffers(subDoc, tables, config.tables, title);
    return { gridDate: findNumericDate(firstPage), offers };
}
