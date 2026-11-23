import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation } from '../../scripts/core/simulation.js';
import { installFreshRegistry } from '../helpers/legacyLoader.mjs';
import { communitySettings } from '../helpers/settings.mjs';
import { makeFullDay, makeGrille } from '../helpers/makeDay.mjs';

const name = 'Enercoop - Flexibilité 2 saisons - Jours de pointe';

test('comparaison à 7 kVA : jours fériés, changement de saison et activation de la pointe en HP', () => {
    installFreshRegistry();
    const dates = ['2026/01/07', '2026/01/08', '2026/01/09', '2026/01/10', '2026/04/01', '2026/05/14'];
    const data = dates.map(date => makeFullDay(date));
    const settings = communitySettings(7);
    const { calculatedMonths: offers } = runSimulation(settings, data);
    const daysFor = (offers, title) => offers.find(o => o.title === title).allMonths.flatMap(m => m.days);
    const peak = daysFor(offers, name);
    assert.deepEqual(peak.map(d => d.hours[0].type),
        ['hiverPointe HC', 'hiver HC', 'hiverPointe HC', 'hiverWeekend HC', 'ete HP', 'eteWeekend HC']);
    assert.deepEqual(peak.map(d => d.consoHC), [10000, 10000, 10000, 24000, 6000, 24000]);
    assert.ok(Math.abs(peak[0].priceHP - 14 * 0.53744) < 1e-9);
    assert.ok(Math.abs(peak[0].priceHC - 10 * 0.21613) < 1e-9);
});

test('une date inconnue empêche un total partiel, même pour le contrat actuel', () => {
    const offer = installFreshRegistry().find(o => o.name === name);
    const control = makeGrille({ prices: [{ puissance: 7, abonnement: 30, bleu: { prixKwhHP: 20, prixKwhHC: 10 } }] });
    globalThis.abonnements = [offer, control];
    const isKnown = offer.calendarCoversDate;
    offer.calendarCoversDate = date => date !== '2026/01/08' && isKnown(date);
    const dates = ['2026/01/07', '2026/01/08', '2026/02/17'];
    const settings = { ...communitySettings(7), currentOffer: name };
    const sim = runSimulation(settings, dates.map(date => makeFullDay(date)));
    assert.deepEqual(sim.missingCalendars, [{ title: name, months: [new Date(2026, 0, 1)] }]);
    assert.deepEqual(sim.calculatedMonths.find(o => o.title === name).allMonths.map(m => m.month), ['02']);
    const earlier = runSimulation(settings, [makeFullDay('2024/01/01')]);
    assert.ok(!earlier.calculatedMonths.some(o => o.title === name));
    assert.ok(earlier.calculatedMonths.some(o => o.title === control.name));
});
