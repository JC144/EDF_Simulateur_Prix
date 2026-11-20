import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation } from '../../scripts/core/simulation.js';
import { parsePeakDates } from '../../scripts/ui/importView.js';
import { installFreshRegistry } from '../helpers/legacyLoader.mjs';
import { communitySettings } from '../helpers/settings.mjs';
import { makeFullDay } from '../helpers/makeDay.mjs';

test('les dates de pointe distinguent calendrier inconnu, aucune alerte et dates valides', () => {
    assert.equal(parsePeakDates(' '), null);
    assert.deepEqual(parsePeakDates('Aucun'), []);
    assert.deepEqual(parsePeakDates('25/12/2026, 01/01/2027'), ['2026/12/25', '2027/01/01']);
    assert.throws(() => parsePeakDates('29/02/2026'), /dates valides/);
});

test('comparaison à 7 kVA : jours fériés, changement de saison et activation de la pointe en HP', () => {
    installFreshRegistry();
    const dates = ['2026/04/01', '2026/04/06', '2026/05/14', '2026/05/25', '2026/12/25', '2026/12/26'];
    const data = dates.map(date => makeFullDay(date));
    const settings = communitySettings(7);
    const results = peakDates => runSimulation({ ...settings, enercoopPeakDates: peakDates }, data).calculatedMonths;
    const name = 'Enercoop - Flexibilité 2 saisons - Jours de pointe';
    const daysFor = (offers, title) => offers.find(o => o.title === title).allMonths.flatMap(m => m.days);
    assert.ok(!results(null).some(o => o.title === name));
    const offers = results(['2026/05/14', '2026/12/26']);
    const peak = daysFor(offers, name);
    assert.equal(peak[0].hours[0].type, 'ete HP'); // 1er avril à 0h30
    assert.deepEqual(peak.map(d => d.consoHC), [6000, 24000, 6000, 24000, 24000, 10000]);
    assert.ok(Math.abs(peak[2].priceHP - 18 * 0.53744) < 1e-9); // Ascension en pointe
    assert.ok(Math.abs(peak[5].priceHC - 10 * 0.21613) < 1e-9); // samedi d'hiver en pointe
    assert.ok(Math.abs(peak[5].priceHP - 14 * 0.53744) < 1e-9);
    const night = daysFor(offers, 'Enercoop - Flexibilité - nuit & week-end');
    assert.deepEqual(night.map(d => d.consoHC), [7000, 24000, 24000, 24000, 24000, 24000]);
    assert.equal(daysFor(results([]), name)[5].consoHC, 24000); // nouvelle simulation sans alerte
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
