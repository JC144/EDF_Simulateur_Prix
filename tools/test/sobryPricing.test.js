const assert = require('node:assert');
const sp = require('../../scripts/tarifs/sobry/sobryPricing.js');

// --- seasonOf : définition réglementaire Nov→Mars hiver, Avr→Oct été ---
assert.strictEqual(sp.seasonOf(1), 'hiver');
assert.strictEqual(sp.seasonOf(3), 'hiver');
assert.strictEqual(sp.seasonOf(4), 'ete');
assert.strictEqual(sp.seasonOf(7), 'ete');
assert.strictEqual(sp.seasonOf(10), 'ete');
assert.strictEqual(sp.seasonOf(11), 'hiver');
assert.strictEqual(sp.seasonOf(12), 'hiver');

const approx = (a, b, msg) => assert.ok(Math.abs(a - b) < 0.01, `${msg}: ${a} vs ${b}`);

// --- computePrixKwhCentimes : renvoie des centimes/kWh TTC ---
// SoCap hiver, spot bas (50 €/MWh) → plafond NON atteint
// spot 0.05 + turpe 0.0632 + accise 0.03085 = 0.14405 (< 0.2167)
// + CEE 0.007 + capacité 0.003 + marge 0.008 + prime 0.007 = 0.16905
// * 1.20 * 100 = 20.286 c/kWh
approx(sp.computePrixKwhCentimes(50, 'hiver', 'socap'), 20.286, 'SoCap hiver bas');

// SoCap hiver, spot haut (300 €/MWh) → plafond ATTEINT (0.2167)
// 0.2167 + 0.007 + 0.003 + 0.008 + 0.007 = 0.2417 ; *1.2*100 = 29.004
approx(sp.computePrixKwhCentimes(300, 'hiver', 'socap'), 29.004, 'SoCap hiver plafonné');

// SoCap été, spot bas (20 €/MWh) → plafond été 0.1125 non atteint
// 0.02 + 0.0149 + 0.03085 = 0.06575 ; + 0.025 (CEE+cap+marge+prime) = 0.09075 ; *1.2*100 = 10.89
approx(sp.computePrixKwhCentimes(20, 'ete', 'socap'), 10.89, 'SoCap été bas');

// SoFlex été, spot bas (20 €/MWh) ; prime 0.002 ; plafond 0.3333 non atteint
// 0.06575 + 0.007+0.003+0.008+0.002 = 0.08575 ; *1.2*100 = 10.29
approx(sp.computePrixKwhCentimes(20, 'ete', 'soflex'), 10.29, 'SoFlex été bas');

// Spot manquant → NaN
assert.ok(Number.isNaN(sp.computePrixKwhCentimes(null, 'hiver', 'socap')), 'spot null → NaN');

// --- parisLocalToUnix : hiver = UTC+1, été = UTC+2 ---
// 2026-01-15 00:00 Paris (CET, +1) = 2026-01-14 23:00 UTC
assert.strictEqual(
    sp.parisLocalToUnix(2026, 1, 15, 0, 0),
    Math.floor(Date.UTC(2026, 0, 14, 23, 0) / 1000),
    'Paris hiver +1'
);
// 2026-07-15 00:00 Paris (CEST, +2) = 2026-07-14 22:00 UTC
assert.strictEqual(
    sp.parisLocalToUnix(2026, 7, 15, 0, 0),
    Math.floor(Date.UTC(2026, 6, 14, 22, 0) / 1000),
    'Paris été +2'
);
// Bascule heure d'été (2026-03-29) : 01:30 Paris est encore en CET (+1)
// = 2026-03-29 00:30 UTC (et non 03-28 23:30)
assert.strictEqual(
    sp.parisLocalToUnix(2026, 3, 29, 1, 30),
    Math.floor(Date.UTC(2026, 2, 29, 0, 30) / 1000),
    'Paris bascule printemps 01:30 CET'
);
// Bascule retour heure d'hiver (2026-10-25) : 02:30 ambigu → interprétation CET
// (seconde occurrence) = 2026-10-25 01:30 UTC. Verrouille le calcul DST arithmétique.
assert.strictEqual(
    sp.parisLocalToUnix(2026, 10, 25, 2, 30),
    Math.floor(Date.UTC(2026, 9, 25, 1, 30) / 1000),
    'Paris bascule automne 02:30 CET'
);
// Décalages aux instants exacts de bascule (UTC)
assert.strictEqual(sp.parisOffsetMinutes(Date.UTC(2026, 2, 29, 1, 0)), 120, 'CEST dès 01:00 UTC fin mars');
assert.strictEqual(sp.parisOffsetMinutes(Date.UTC(2026, 2, 29, 0, 59)), 60, 'CET avant 01:00 UTC fin mars');
assert.strictEqual(sp.parisOffsetMinutes(Date.UTC(2026, 9, 25, 1, 0)), 60, 'CET dès 01:00 UTC fin octobre');

// --- spotEurMwhForInterval : moyenne des 15 min recouverts ---
// Grille démarrant à 2026-01-15 00:00 Paris, 4 créneaux : 10,20,30,40 €/MWh
const startUnix = sp.parisLocalToUnix(2026, 1, 15, 0, 0);
const spotData = { start_unix: startUnix, step_seconds: 900, prices: [10, 20, 30, 40, 50, 60, 70, 80] };
// pas horaire (60 min) à 00:00 → moyenne des 4 premiers = 25
approx(sp.spotEurMwhForInterval(spotData, '2026/01/15', { hour: 0, minute: 0 }, 60), 25, 'moyenne horaire');
// pas 30 min à 01:00 → créneaux idx 4,5 = (50+60)/2 = 55
approx(sp.spotEurMwhForInterval(spotData, '2026/01/15', { hour: 1, minute: 0 }, 30), 55, 'moyenne 30 min');
// hors plage → null
assert.strictEqual(sp.spotEurMwhForInterval(spotData, '2026/01/16', { hour: 0, minute: 0 }, 60), null, 'hors plage null');

// --- makeGetPrixKwh : lit global.spotPrices, renvoie des centimes/kWh ---
globalThis.spotPrices = { start_unix: sp.parisLocalToUnix(2026, 1, 15, 0, 0), step_seconds: 900, prices: new Array(8).fill(50) };
const getPrix = sp.makeGetPrixKwh('socap');
// 2026/01/15 00:00, pas horaire → spot moyen 50 €/MWh, hiver → 20.286 c/kWh
approx(getPrix('2026/01/15', { hour: 0, minute: 0 }, 'bleu', false, 60), 20.286, 'getPrixKwh SoCap');
// hors plage → NaN
assert.ok(Number.isNaN(getPrix('2026/02/01', { hour: 0, minute: 0 }, 'bleu', false, 60)), 'getPrixKwh hors plage NaN');
delete globalThis.spotPrices;

console.log('sobryPricing OK');
