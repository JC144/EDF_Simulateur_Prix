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

test('la sélection d’un contrat local le rend comparable au tarif national', () => {
    const local = lookup('GEG - Tarif Bleu (zone GEG) - Base');
    const other = lookup('Dyneff - Contrat+ Électricité - Base');
    globalThis.window = { abonnements: [local, other] };
    const days = [makeFullDay('2026/01/01')];
    const settings = communitySettings(6);
    assert.deepEqual(runSimulation(settings, days).calculatedMonths.map(t => t.title), [other.name]);
    assert.deepEqual(runSimulation({ ...settings, currentOffer: local.name }, days).calculatedMonths.map(t => t.title), [local.name, other.name]);
});
