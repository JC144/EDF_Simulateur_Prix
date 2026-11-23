import { buildOffer, KVAS } from './table.mjs';
import { euroPerKwhToCents, parseFrNumber } from './fr-numbers.mjs';

// Lignes TTC publiées pour les puissances résidentielles usuelles.
export function gridRow(kva, subscription, ...rates) {
    const values = [subscription, ...rates].map(parseFrNumber);
    if (values.some(v => !Number.isFinite(v))) throw new Error('Montant TTC illisible pour ' + kva + ' kVA');
    return { kva, values: [values[0], ...values.slice(1).map(euroPerKwhToCents)] };
}

export function pairedOffers(name, base, hc) {
    for (const [rows, expected] of [[base, KVAS], [hc, KVAS.slice(1)]]) {
        if (rows.map(r => r.kva).join(',') !== expected.join(',')) throw new Error('Puissances inattendues : ' + name);
    }
    return {
        [name + ' - Base']: buildOffer(base, [['bleu.price']]),
        [name + ' - HP/HC']: buildOffer(hc, [['bleu.HP'], ['bleu.HC']]),
    };
}

export function addEnergyCharge(offer, cents, base = false) {
    function adjust(dayTypes) {
        const bleu = {};
        for (const [field, value] of Object.entries(dayTypes.bleu)) {
            bleu[base ? 'price' : field] = Number((value + cents).toFixed(6));
        }
        return { bleu };
    }
    const result = { subscriptions: offer.subscriptions, dayTypes: adjust(offer.dayTypes) };
    if (offer.priceOverrides) result.priceOverrides = Object.fromEntries(
        Object.entries(offer.priceOverrides).map(([kva, prices]) => [kva, adjust(prices)]));
    return result;
}
