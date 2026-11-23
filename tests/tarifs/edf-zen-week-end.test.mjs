import { test } from 'node:test';
import assert from 'node:assert';
import { byName } from '../helpers/daytype.mjs';

test('Zen Week-End : samedi et dimanche -> weekend', () => {
    const zenWE = byName('EDF - Zen Week-End');

    assert.strictEqual(zenWE.getDayType({ date: '2026/07/11' }), 'weekend'); // samedi
    assert.strictEqual(zenWE.getDayType({ date: '2026/07/12' }), 'weekend'); // dimanche
    assert.strictEqual(zenWE.getDayType({ date: '2026/07/10' }), 'bleu');    // vendredi
    assert.strictEqual(zenWE.getDayType({ date: '2026/07/13' }), 'bleu');    // lundi
});
