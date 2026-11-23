import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation } from '../../scripts/core/simulation.js';
import { installFreshRegistry } from '../helpers/legacyLoader.mjs';
import { communitySettings } from '../helpers/settings.mjs';
import { makeFullDay } from '../helpers/makeDay.mjs';

test('Nuit & week-end à 7 kVA : jours fériés et changement de saison', () => {
    installFreshRegistry();
    const dates = ['2026/01/07', '2026/01/08', '2026/01/09', '2026/01/10', '2026/04/01', '2026/05/14'];
    const data = dates.map(date => makeFullDay(date));
    const settings = communitySettings(7);
    const { calculatedMonths: offers } = runSimulation(settings, data);
    const daysFor = (offers, title) => offers.find(o => o.title === title).allMonths.flatMap(m => m.days);
    const night = daysFor(offers, 'Enercoop - Flexibilité - nuit & week-end');
    assert.deepEqual(night.map(d => d.consoHC), [7000, 7000, 7000, 24000, 7000, 24000]);
});

test('Nuit & week-end : les quarts d’heure suivant 6h et 23h changent de prix', () => {
    installFreshRegistry();
    const hours = Array.from({ length: 96 }, (_, i) => {
        const minutes = (i + 1) * 15;
        return [Math.floor(minutes / 60) + ':' + String(minutes % 60).padStart(2, '0'), '1000'];
    });
    const { calculatedMonths } = runSimulation(communitySettings(7), [{ date: '2026/04/01', hours }]);
    const day = calculatedMonths.find(o => o.title.endsWith('nuit & week-end')).allMonths[0].days[0];
    assert.equal(day.consoHC, 7000);
    for (const [index, type] of [[23, 'HC'], [24, 'HP'], [91, 'HP'], [92, 'HC']]) {
        assert.equal(day.hours[index].type, 'bleu ' + type);
    }
});
