import { test } from 'node:test';
import assert from 'node:assert';
import { byName, at } from '../helpers/daytype.mjs';

test('EJP : pas de règle 6h, la date du jour est utilisée telle quelle', () => {
    const ejp = byName('EDF - EJP');

    // 2025/03/14 est un jour de pointe
    assert.strictEqual(ejp.getDayType({ date: '2025/03/14' }, at(5)), 'rouge');
    assert.strictEqual(ejp.getDayType({ date: '2025/03/15' }, at(5)), 'bleu', 'EJP ne reporte pas la couleur de la veille');
    assert.strictEqual(ejp.getDayType({ date: '2025/03/14' }, at(12)), 'rouge');
});
