const assert = require('node:assert');
const sp = require('../../scripts/tarifs/sobry/sobryPricing.js');
const { calculator } = require('../../scripts/calculator.js');

const approx = (a, b, msg) => assert.ok(Math.abs(a - b) < 0.02, `${msg}: ${a} vs ${b}`);

// Grille Sobry SoCap minimale (6 kVA), abonnement déjà calculé
const grille = {
    prices: [{ puissance: 6, abonnement: 21.04, bleu: { prixKwhHC: 0, prixKwhHP: 0 } }],
    hc: [],
    getDayType: function () { return 'bleu'; },
    getPrixKwh: sp.makeGetPrixKwh('socap')
};

// 24 pas horaires, 1000 Wh chacun (1 kWh)
function makeHours() {
    const hours = [];
    for (let h = 0; h < 24; h++) {
        hours.push([`${String(h).padStart(2, '0')}:00:00`, '1000']);
    }
    return hours;
}

// Construit les données pour tout un mois (toutes les journées)
function makeMonthData(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const data = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const mm = String(month).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        data.push({ date: `${year}/${mm}/${dd}`, hours: makeHours() });
    }
    return data;
}

// Spot constant 50 €/MWh couvrant tout janvier 2026 (31 jours × 96 créneaux 15 min)
const janStart = sp.parisLocalToUnix(2026, 1, 1, 0, 0);
globalThis.spotPrices = {
    start_unix: janStart,
    step_seconds: 900,
    prices: new Array(31 * 96).fill(50)
};

// --- Mois couvert : énergie HP = 24 kWh/jour, coût énergie = 24 * 0.20286 € ---
const janData = makeMonthData(2026, 1);
const m1 = calculator.getTarif(6, janData, grille);
const day15 = m1[0].days[14]; // 2026-01-15 (index 14)
approx(day15.consoHP, 24000, 'conso HP Wh');
const energie = day15.hours.reduce((a, b) => a + (isNaN(b.price) ? 0 : b.price), 0);
approx(energie, 24 * 0.20286, 'coût énergie jour');
assert.ok(!m1[0].hasErrors, 'mois couvert : pas d\'erreur');

// --- Mois NON couvert (hors plage spot) : chaque jour facturé abonnement seul, mois en erreur ---
const marData = makeMonthData(2026, 3);
const m2 = calculator.getTarif(6, marData, grille);
approx(m2[0].days[0].price, 21.04 / 31, 'jour non couvert = abo/jour');
assert.ok(m2[0].hasErrors, 'mois non couvert : mois en erreur');
// Flag dédié exploité par le résumé UI pour afficher l'erreur explicite
assert.ok(m2[0].spotMissing, 'mois non couvert : flag spotMissing au niveau mois');

delete globalThis.spotPrices;
console.log('Task 4 OK');
