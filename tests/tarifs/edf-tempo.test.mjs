import { test } from 'node:test';
import assert from 'node:assert';
import { byName, at } from '../helpers/daytype.mjs';

test('Tempo : avant 6h la couleur est celle de la veille', () => {
    const tempo = byName('EDF - Tempo');

    // 2026/01/07 est rouge, 2026/01/08 est blanc
    assert.strictEqual(tempo.getDayType({ date: '2026/01/08' }, at(5, 30)), 'rouge');
    assert.strictEqual(tempo.getDayType({ date: '2026/01/08' }, at(6)), 'blanc');
    assert.strictEqual(tempo.getDayType({ date: '2026/01/08' }, at(12)), 'blanc');
    // 24:00 (minuit rattaché à la veille par le parser) n'est PAS < 6h : date du jour
    assert.strictEqual(tempo.getDayType({ date: '2026/01/07' }, at(24)), 'rouge');
    // jour non listé -> bleu
    assert.strictEqual(tempo.getDayType({ date: '2024/07/15' }, at(12)), 'bleu');
    assert.strictEqual(tempo.getDayType({ date: '2024/07/15' }, at(3)), 'bleu');
});
