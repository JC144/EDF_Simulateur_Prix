import { test } from 'node:test';
import assert from 'node:assert';
import { byName } from '../helpers/daytype.mjs';

test('Zen Week-End Plus : le jour personnalisé poussé dans specialDays devient weekend', () => {
    const zenWEPlus = byName('EDF - Zen Week-End Plus');
    assert.strictEqual(zenWEPlus.hasSpecialDaysCustom, true);

    assert.strictEqual(zenWEPlus.getDayType({ date: '2026/07/13' }), 'bleu'); // lundi avant customisation
    zenWEPlus.specialDays.push(1); // ce que fait addCustomisationToAbonnements avec jourZenPlus=1
    assert.strictEqual(zenWEPlus.getDayType({ date: '2026/07/13' }), 'weekend');
});
