import test from 'node:test';
import assert from 'node:assert/strict';
import { createTarifSandbox } from '../helpers/legacyLoader.mjs';
import { communitySettings } from '../helpers/settings.mjs';
import { makeFullDay } from '../helpers/makeDay.mjs';
import { runSimulation } from '../../scripts/core/simulation.js';

const sandbox = createTarifSandbox();
const lookup = name => sandbox.abonnements.find(offer => offer.name === name);
const priceAt = (day, hour) => day.hours.find(row => row.time.hour === hour && row.time.minute === 30).price;

test('Heures Eco+ facture uniquement les créneaux de vigilance, y compris en dehors des HC', () => {
    const offer = lookup('TotalEnergie - Heures Eco+ - Jours Éclair');
    globalThis.window = { abonnements: [offer] };
    const { calculatedMonths } = runSimulation(communitySettings(6), [makeFullDay('2024/12/10')]);
    const day = calculatedMonths[0].allMonths[0].days[0];
    const plan = offer.prices.find(p => p.puissance === 6);
    assert.equal(priceAt(day, 7), plan.vigilance.prixKwhHP / 200);
    assert.equal(priceAt(day, 15), plan.eclair.prixKwhHP / 200);
    assert.equal(priceAt(day, 18), plan.vigilance.prixKwhHP / 200);
    assert.equal(offer.calendarCoversDate('2020/01/01'), false);
});
