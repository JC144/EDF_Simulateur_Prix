import { test } from 'node:test';
import assert from 'node:assert';
import { runSimulation, simulateOffers, buildHCRanges } from '../../scripts/core/simulation.js';
import { defaultSettings } from '../helpers/settings.mjs';
import { makeFullDay, makeGrille } from '../helpers/makeDay.mjs';

// Registre de stubs : simulation.js lit window.abonnements via tarifsRegistry.
function installStubRegistry(abonnements) {
    globalThis.window = globalThis;
    globalThis.abonnements = abonnements;
    return abonnements;
}

const DATA = [makeFullDay('2024/03/05', 1000)];

test('un résultat complet est disponible après chaque offre calculée, même après une exclusion', () => {
    const excluded = { ...makeGrille({ name: 'EDF - Calendrier incomplet' }), calendarCoversDate: () => false };
    const offers = [excluded, makeGrille({ name: 'EDF - A' }), makeGrille({ name: 'EDF - B' })];
    installStubRegistry(offers);
    const settings = defaultSettings(6);
    const steps = simulateOffers(settings, DATA, offers);
    const first = steps.next().value;
    assert.equal(first.completed, 1);
    assert.deepEqual(first.simulation.calculatedMonths, []);
    assert.equal(first.simulation.missingCalendars[0].title, excluded.name);
    const second = steps.next().value;
    assert.equal(second.completed, 2);
    assert.deepEqual(second.simulation.yearsAvailable, [2024]);
    assert.deepEqual(second.simulation.calculatedMonths.map(offer => offer.title), ['EDF - A']);
    assert.ok(second.simulation.calculatedMonths[0].allMonths[0].price > 0);
    assert.equal(steps.next().value.completed, offers.length);
    const last = steps.next();
    assert.equal(last.done, true);
    assert.deepEqual(last.value, runSimulation(settings, DATA));
});

test('buildHCRanges : arrondi à l\'heure (23:59 -> 24:00), plage vide ou inversée rejetée', () => {
    assert.deepStrictEqual(buildHCRanges([
        ['22:00', '23:59'], // 23:59 -> 24:00
        ['06:40', '21:00'], // 06:40 -> 07:00 (minutes > 30 font monter l'heure)
        ['10:20', '11:15'], // minutes <= 30 conservées telles quelles
        ['22:40', '23:20'], // 23:00 -> 23:20 : heures égales -> rejetée
        ['00:00', '00:00']  // plage vide -> rejetée
    ]), [
        { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
        { start: { hour: 7, minute: 0 }, end: { hour: 21, minute: 0 } },
        { start: { hour: 10, minute: 20 }, end: { hour: 11, minute: 15 } }
    ]);
});

test('hasHCCustom : les plages saisies s\'appliquent à la vue résolue, sans muter le registre', () => {
    const custom = makeGrille({ name: 'EDF - Stub HC', hasHCCustom: true, hc: [] });
    // Grille de référence : mêmes plages, mais fixées dans la définition.
    const reference = makeGrille({
        name: 'EDF - Stub référence',
        hc: [
            { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
            { start: { hour: 0, minute: 0 }, end: { hour: 7, minute: 0 } }
            // la 3e plage 00:00 -> 00:00 des réglages par défaut est rejetée
        ]
    });
    installStubRegistry([custom, reference]);

    const { calculatedMonths } = runSimulation(defaultSettings(6), DATA);

    assert.deepStrictEqual(calculatedMonths[0].allMonths, calculatedMonths[1].allMonths,
        'les plages saisies doivent produire le même calcul que des plages fixes équivalentes');
    assert.deepStrictEqual(custom.hc, [], 'le hc du registre ne doit pas être écrasé');
});

test('hasSpecialDaysCustom : jourZenPlus appliqué à la vue résolue, sans mutation ni accumulation', () => {
    const weeklyGetDayType = function (day) {
        return this.specialDays.includes(new Date(day.date).getDay()) ? 'weekend' : 'bleu';
    };
    const prices = [{
        puissance: 6, abonnement: 30,
        bleu: { prixKwhHP: 20, prixKwhHC: 10 },
        weekend: { prixKwhHP: 2, prixKwhHC: 1 }
    }];
    const custom = makeGrille({
        name: 'EDF - Stub Zen', hasSpecialDaysCustom: true,
        specialDays: [0, 6], prices, getDayType: weeklyGetDayType
    });
    // Grille de référence : jour Zen+ (lundi = 1) déjà intégré à la définition.
    const reference = makeGrille({
        name: 'EDF - Stub Zen référence',
        specialDays: [0, 6, 1], prices, getDayType: weeklyGetDayType
    });
    installStubRegistry([custom, reference]);

    const monday = [makeFullDay('2024/03/04', 1000)]; // un lundi
    const first = runSimulation(defaultSettings(6), monday);
    assert.deepStrictEqual(first.calculatedMonths[0].allMonths, first.calculatedMonths[1].allMonths,
        'le jour Zen+ doit être vu par getDayType via la vue résolue');
    assert.deepStrictEqual(custom.specialDays, [0, 6], 'le registre ne doit pas être muté');

    const second = runSimulation(defaultSettings(6), monday);
    assert.deepStrictEqual(custom.specialDays, [0, 6], 'pas d\'accumulation entre simulations');
    assert.deepStrictEqual(second.calculatedMonths, first.calculatedMonths, 're-simulation déterministe');
});

test('filtre communautaire : sans opt-in, seules les offres du fournisseur EDF sont incluses', () => {
    installStubRegistry([
        makeGrille({ name: 'EDF - Bleu Stub' }),
        makeGrille({ name: 'Autre - Offre indexée sur le tarif EDF' })
    ]);

    const { calculatedMonths } = runSimulation(defaultSettings(6), DATA);
    assert.deepStrictEqual(calculatedMonths.map(t => t.title), ['EDF - Bleu Stub']);

    const settings = defaultSettings(6);
    settings.includeCommunity = true;
    const withCommunity = runSimulation(settings, DATA);
    assert.deepStrictEqual(withCommunity.calculatedMonths.map(t => t.title),
        ['EDF - Bleu Stub', 'Autre - Offre indexée sur le tarif EDF']);
});

test('propagation : display, offer_type et price_url descendent jusqu\'aux résultats', () => {
    const display = { types: { bleu: { day: null, bands: { HP: 'HP', HC: 'HC' } } }, dayOrder: [], bandOrder: ['HP', 'HC'] };
    installStubRegistry([makeGrille({
        name: 'EDF - Stub',
        offer_type: 'TRV',
        price_url: 'https://example.org/grille.pdf',
        display
    })]);

    const { calculatedMonths } = runSimulation(defaultSettings(6), DATA);
    assert.strictEqual(calculatedMonths[0].offer_type, 'TRV');
    assert.strictEqual(calculatedMonths[0].price_url, 'https://example.org/grille.pdf');
    assert.deepStrictEqual(calculatedMonths[0].display, display);
});

test('kva en string (flux réel UI) : mêmes résultats qu\'en number', () => {
    installStubRegistry([makeGrille({ name: 'EDF - Stub' })]);

    const asNumber = runSimulation(defaultSettings(6), DATA);
    const asString = runSimulation(defaultSettings('6'), DATA);

    assert.strictEqual(asString.calculatedMonths.length, 1, 'le filtre par puissance doit accepter une string');
    assert.deepStrictEqual(asString.calculatedMonths, asNumber.calculatedMonths);
});

test('filtre par puissance souscrite : abonnement sans la puissance exclu', () => {
    installStubRegistry([
        makeGrille({ name: 'EDF - 6kVA seulement' }),
        makeGrille({
            name: 'EDF - 9kVA seulement',
            prices: [{ puissance: 9, abonnement: 20, bleu: { prixKwhHP: 20, prixKwhHC: 10 } }]
        })
    ]);

    const { calculatedMonths } = runSimulation(defaultSettings(6), DATA);
    assert.deepStrictEqual(calculatedMonths.map(t => t.title), ['EDF - 6kVA seulement']);
});
