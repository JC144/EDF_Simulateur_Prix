import { test } from 'node:test';
import assert from 'node:assert';
import { byName, at } from '../helpers/daytype.mjs';

test('Zen Week-End Option Flex : calendrier sobriete sans règle 6h', () => {
    const flex = byName('EDF - Zen Week-End Option Flex');
    assert.strictEqual(flex.hasSpecialDaysCustom, false);

    // 2026/01/26 est un jour sobriete
    assert.strictEqual(flex.getDayType({ date: '2026/01/26' }, at(5)), 'sobriete');
    assert.strictEqual(flex.getDayType({ date: '2026/01/27' }, at(5)), 'bleu', 'pas de report de la veille');
    assert.strictEqual(flex.getDayType({ date: '2026/01/26' }, at(12)), 'sobriete');
});
