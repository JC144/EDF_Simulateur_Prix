import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as mylight150 } from '../parsers/mylight150.mjs';

test('mylight150 : nouvelle édition à revoir et majoration annuelle répartie sur douze mois', () => {
    assert.throws(() => mylight150({ sha256: 'nouvelle édition' }), /Nouvelle grille/);
    const { offers } = mylight150({ sha256: '9ca4925c1f00cce20d58b8842870105ba24e9366e6424ba11b00ab1469926a03' });
    assert.equal(Object.keys(offers).length, 8);
    const standard = offers['mylight150 - Vert de France Standard autoproducteur - HP/HC'];
    assert.equal(standard.subscriptions[6], 21.684);
    assert.deepEqual(standard.dayTypes.bleu, { HP: 25.4, HC: 19 });
    assert.equal(standard.subscriptions[3], undefined);
});
