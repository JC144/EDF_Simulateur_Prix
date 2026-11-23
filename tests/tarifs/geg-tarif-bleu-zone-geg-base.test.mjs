import test from 'node:test';
import assert from 'node:assert/strict';
import { createTarifSandbox } from '../helpers/legacyLoader.mjs';
import { communitySettings } from '../helpers/settings.mjs';
import { makeFullDay, makeGrille } from '../helpers/makeDay.mjs';
import { runSimulation } from '../../scripts/core/simulation.js';

const sandbox = createTarifSandbox();
const lookup = name => sandbox.abonnements.find(offer => offer.name === name);

test('la sélection d’un contrat local le rend comparable au tarif national', () => {
    const local = lookup('GEG - Tarif Bleu (zone GEG) - Base');
    const other = makeGrille({ name: 'Test - Contrat national' });
    globalThis.window = { abonnements: [local, other] };
    const days = [makeFullDay('2026/01/01')];
    const settings = communitySettings(6);
    assert.deepEqual(runSimulation(settings, days).calculatedMonths.map(t => t.title), [other.name]);
    assert.deepEqual(runSimulation({ ...settings, currentOffer: local.name }, days).calculatedMonths.map(t => t.title), [local.name, other.name]);
});
