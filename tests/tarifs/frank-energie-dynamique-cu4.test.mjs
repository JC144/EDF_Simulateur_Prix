import test from 'node:test';
import assert from 'node:assert/strict';
import { createTarifSandbox } from '../helpers/legacyLoader.mjs';
import { communitySettings } from '../helpers/settings.mjs';
import { makeFullDay } from '../helpers/makeDay.mjs';
import { runSimulation } from '../../scripts/core/simulation.js';

const sandbox = createTarifSandbox();
const lookup = name => sandbox.abonnements.find(offer => offer.name === name);
const priceAt = (day, hour) => day.hours.find(row => row.time.hour === hour && row.time.minute === 30).price;

test('le cours EPEX horaire signé s’ajoute à la part TTC du créneau Frank', () => {
    const offer = lookup('Frank Énergie - Dynamique CU4');
    globalThis.window = { abonnements: [offer] };
    const date = '2026/02/02';
    sandbox.SpotPrices['epex-fr'].days[date] = Array.from({ length: 96 }, (_, i) => [-100, -50, 0, 50][i % 4]);
    const { calculatedMonths } = runSimulation(communitySettings(6), [makeFullDay(date)]);
    const day = calculatedMonths[0].allMonths[0].days[0];
    const winter = offer.prices.find(p => p.puissance === 6).hiver;
    // Moyenne horaire -25 €/MWh HT, soit -3 c€/kWh TTC ; 0,5 kWh par relevé.
    assert.ok(Math.abs(priceAt(day, 9) - (winter.prixKwhHP - 3) / 200) < 1e-12);
    assert.ok(Math.abs(priceAt(day, 2) - (winter.prixKwhHC - 3) / 200) < 1e-12);
});
