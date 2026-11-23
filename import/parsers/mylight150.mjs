import { buildOffer } from '../lib/table.mjs';
import { fetchGrille } from '../lib/download.mjs';

// La grille officielle est composée d’images. Les montants TTC ci-dessous
// proviennent des pages 3–4 du catalogue d’octobre 2026, vérifiées sur le PDF.
const sourceHash = '9ca4925c1f00cce20d58b8842870105ba24e9366e6424ba11b00ab1469926a03';
const subscriptions = [
    // kVA, Base, HP/HC (€/mois TTC)
    [3, 13.31, null], [6, 17.08, 20.70], [9, 21.15, 24.79],
    [12, 25.07, 29.56], [15, 28.75, 32.55], [18, 32.54, 36.97],
    [24, 40.62, 46.37], [30, 48.05, 54.26], [36, 55.54, 62.26],
];

export async function discoverUrl() {
    const { buffer } = await fetchGrille('https://www.mylight150.com/pages-legales/conditions-generales');
    const matches = [...buffer.toString('utf8').matchAll(/href="(https:\/\/cdn\.prod\.website-files\.com\/65f08fc6f2c52e2310a49dcb\/[^"]+\.pdf)"/gi)];
    const candidates = new Set(matches.map(m => m[1]).filter(url => /GRILLE[\s_-]*TARIFAIRE/i.test(decodeURIComponent(url))));
    if (candidates.size !== 1) throw new Error('Catalogue tarifaire mylight150 absent ou ambigu');
    return [...candidates][0];
}

export function parse(doc) {
    if (doc.sha256 !== sourceHash) throw new Error('Nouvelle grille mylight150 en images : vérifier le tableau TTC et les conditions de la remise');
    const offers = {};
    for (const [period, intro] of [['Bienvenue', true], ['Standard', false]]) {
        for (const producer of [false, true]) {
            // Majoration annuelle des auto-producteurs sans stockage, 9,84 € HT avec TVA à 20 %.
            const surcharge = producer ? 9.84 * 1.20 / 12 : 0;
            const name = 'mylight150 - Vert de France ' + period + (producer ? ' autoproducteur' : '');
            const base = [], hc = [];
            for (const [kva, subBase, subHc] of subscriptions) {
                const basePrice = intro ? (kva <= 6 ? 20.01 : 19.85) : (kva <= 6 ? 23.36 : 23.20);
                base.push({ kva, values: [Number((subBase + surcharge).toFixed(4)), basePrice] });
                if (subHc !== null) hc.push({ kva, values: [Number((subHc + surcharge).toFixed(4)), intro ? 21.42 : 25.40, intro ? 15.89 : 19.00] });
            }
            offers[name + ' - Base'] = buildOffer(base, [['bleu.price']]);
            offers[name + ' - HP/HC'] = buildOffer(hc, [['bleu.HP'], ['bleu.HC']]);
        }
    }
    return { gridDate: '2026-10-01', offers };
}
