import { test } from 'node:test';
import assert from 'node:assert';
import { byName, at } from '../helpers/daytype.mjs';

test('Zen Estival : saisons aux frontières de mois (hiver = novembre à mars)', () => {
    const estival = byName('EDF - Zen Estival');

    // 9h : hors plages super creuses des deux saisons
    assert.strictEqual(estival.getDayType({ date: '2024/10/31' }, at(9)), 'ete');
    assert.strictEqual(estival.getDayType({ date: '2024/11/01' }, at(9)), 'hiver');
    assert.strictEqual(estival.getDayType({ date: '2025/03/31' }, at(9)), 'hiver');
    assert.strictEqual(estival.getDayType({ date: '2025/04/01' }, at(9)), 'ete');
});

test('Zen Estival : règle 6h sur la saison, sous-types super creuses selon l\'heure', () => {
    const estival = byName('EDF - Zen Estival');

    // avant 6h le 1er novembre : la veille est en octobre -> été (heure 3 hors 11h-18h -> pas SC)
    assert.strictEqual(estival.getDayType({ date: '2024/11/01' }, at(3)), 'ete');

    // Super creuses été 11h-18h : le relevé étiqueté T couvre ]T-pas ; T],
    // la fenêtre couvre donc les relevés ]11h ; 18h] (même convention que HP/HC).
    assert.strictEqual(estival.getDayType({ date: '2024/07/15' }, at(10)), 'ete');
    assert.strictEqual(estival.getDayType({ date: '2024/07/15' }, at(11)), 'ete', 'le relevé 11:00 couvre 10:30-11:00, avant la fenêtre SC');
    assert.strictEqual(estival.getDayType({ date: '2024/07/15' }, at(11, 30)), 'eteSC');
    assert.strictEqual(estival.getDayType({ date: '2024/07/15' }, at(17)), 'eteSC');
    assert.strictEqual(estival.getDayType({ date: '2024/07/15' }, at(18)), 'eteSC', 'le relevé 18:00 couvre 17:30-18:00, dans la fenêtre SC');
    assert.strictEqual(estival.getDayType({ date: '2024/07/15' }, at(18, 30)), 'ete');

    // super creuses hiver : 22h-24h et 0h-7h
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(21)), 'hiver');
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(22)), 'hiver', 'le relevé 22:00 couvre 21:30-22:00, avant la fenêtre SC');
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(22, 30)), 'hiverSC');
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(2)), 'hiverSC');
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(6, 30)), 'hiverSC');
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(7)), 'hiverSC', 'le relevé 7:00 couvre 6:30-7:00, dans la fenêtre SC');
    // minuit : heure 24 (relevé 23:30-24:00 rattaché à la veille), dans la fenêtre 22h-24h
    assert.strictEqual(estival.getDayType({ date: '2024/12/15' }, at(24)), 'hiverSC');
});
