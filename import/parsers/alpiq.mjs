// Grille Alpiq (gtr_elec_part.pdf) : grille d'électricité en page 1,
// deux tableaux côte à côte (Base / Heures Creuses). Toutes les puissances
// entières, abonnement HT/TTC par ligne, prix kWh en cellules fusionnées
// avec double série TRV/Alpiq (6 décimales en €/kWh). Le repo stocke les
// TTC Alpiq.
import { findKvaTables, extractConfiguredOffers } from '../lib/table.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { pageToText } from '../lib/pdf-text.mjs';

import { addEnergyCharge } from '../lib/residential-grid.mjs';

export const provider = 'alpiq';

const CONFIGS = [
    // abo HT/TTC + [TRV HT, TRV TTC, Alpiq HT, Alpiq TTC]
    { offer: 'Alpiq - Base', colCount: 6, abo: 1, prices: [[5, ['bleu.HP', 'bleu.HC']]] },
    // abo HT/TTC + HP [TRV HT, TRV TTC, Alpiq HT, Alpiq TTC] + HC [idem]
    { offer: 'Alpiq - Heures Creuses', colCount: 10, abo: 1, prices: [[5, ['bleu.HP']], [9, ['bleu.HC']]] },
];

// En novembre 2026 le TTC HC à 36 kVA est superposé au HT Base.
// Rétablir sa position uniquement si les deux HT et les deux TTC concordent.
// Sinon la lecture générique prendrait le tarif 35 kVA pour une cellule fusionnée.
function alignLastSubscription(page, tables) {
    if (tables.length !== 2) return page;
    const [base, hc] = tables;
    function amounts(table, kva, xMax) {
        const row = table.rows.find(r => r.kva === kva);
        if (!row) return [];
        return page.items.filter(it => Math.abs(it.y - row.y) < 2.5
            && it.x > table.kvaX && it.x < xMax && /^\d+[,.]\d{2}$/.test(it.str))
            .sort((a, b) => a.x - b.x);
    }
    const right = amounts(hc, '36', Infinity);
    if (right.length === 2) return page;
    const left = amounts(base, '36', hc.kvaX);
    const previous = amounts(hc, '35', Infinity);
    if (right.length !== 1 || left.length !== 3 || previous.length !== 2) {
        throw new Error('Alpiq : abonnement HC 36 kVA incomplet');
    }
    const [overlap, other, ttc] = left;
    const misplaced = [overlap, other].find(it => it.str === ttc.str);
    if (!misplaced || overlap.x !== other.x || ![overlap, other].some(it => it.str === right[0].str)) {
        throw new Error('Alpiq : abonnement HC 36 kVA ambigu');
    }
    return { ...page, items: page.items.map(it => it === misplaced ? { ...it, x: previous[1].x } : it) };
}

export function parse(doc) {
    const tables = findKvaTables({ pages: [doc.pages[0]] });
    // PDF très dense : certaines colonnes ne sont espacées que de ~2.7 pts,
    // et chaque nombre y est un item entier (pas de chiffres fragmentés) —
    // on peut donc couper les cellules au moindre écart.
    const pages = [alignLastSubscription(doc.pages[0], tables)];
    const offers = extractConfiguredOffers({ pages }, tables, CONFIGS, 'gtr_elec_part.pdf', { cellGap: 1 });
    const options = doc.pages.slice(1).map(pageToText).join('\n');
    if (/Prix option Électricité verte/i.test(options)) {
        const price = options.match(/Prix option Électricité verte[\s\S]{0,300}?(\d+[,.]\d+)\s*€\/kWh TTC/i);
        if (!price) throw new Error('Supplément TTC Alpiq introuvable');
        const cents = Number(price[1].replace(',', '.')) * 100;
        offers['Alpiq - Sérénité 100 % verte - Base'] = addEnergyCharge(offers['Alpiq - Base'], cents, true);
        offers['Alpiq - Sérénité 100 % verte - HP/HC'] = addEnergyCharge(offers['Alpiq - Heures Creuses'], cents);
    }
    return { gridDate: findNumericDate(pageToText(doc.pages[0])), offers };
}
