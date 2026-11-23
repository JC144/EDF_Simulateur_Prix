import { buildOffer } from '../lib/table.mjs';

// Page 1, tableau TTC en image. La fiche facture une puissance intermédiaire
// à l'abonnement de la puissance publiée immédiatement supérieure.
const sha256 = 'e397868fbf985e7dfe702ce8077223a0e1ccde285e1ab96929b57a490807d2ab';
const bands = [
    [3, 16.31, 21.16], [6, 21.62, 21.62], [9, 27.35, 27.35],
    [12, 32.83, 32.83], [15, 38, 38], [18, 43.32, 43.33],
    [24, 54.68, 54.68], [30, 65.09, 65.11], [36, 75.61, 75.61],
];

export function parse(doc) {
    if (doc.sha256 !== sha256) throw new Error('Nouvelle édition Primeo : vérifier le tableau TTC en image');
    const base = [], hc = [];
    for (let kva = 3; kva <= 36; kva++) {
        const [, sub, subHc] = bands.find(([limit]) => kva <= limit);
        base.push({ kva, values: [sub, kva <= 6 ? 24.75 : 24.64] });
        hc.push({ kva, values: [subHc, 25.59, 20.53] });
    }
    return { gridDate: '2026-11-04', offers: {
        'Primeo Energie - Fixe Sereine - Base': buildOffer(base, [['bleu.price']]),
        'Primeo Energie - Fixe Sereine - HP/HC': buildOffer(hc, [['bleu.HP'], ['bleu.HC']]),
    } };
}
