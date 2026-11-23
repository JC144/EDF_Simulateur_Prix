import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as alpiq } from '../parsers/alpiq.mjs';
import { row } from './helpers/pdf-row.mjs';

test('Alpiq : tranche Base 3–6 kVA et TTC 36 kVA HC imprimé dans le tableau Base', () => {
    const items = [];
    const y = kva => 800 - kva * 12;
    for (let kva = 3; kva <= 36; kva++) {
        const monthly = kva === 36 ? '53,88' : '52,64';
        items.push(...row(y(kva), 10, [`${kva} kVA`, '39,71', monthly]));
        if (kva >= 6) {
            items.push(...row(y(kva), 260, [`${kva} kVA`, '39,71']));
            items.push(...row(y(kva), kva === 36 ? 40 : 320, [monthly]));
        }
    }
    for (const [kva, price] of [[4.5, '0,199248'], [21.5, '0,197695']]) {
        items.push(...row(y(kva), 100, ['0,136100', '0,200064', '0,135420', price]));
    }
    items.push(...row(y(21), 350, Array(8).fill('0,150000')));
    const doc = { pages: [{ items }] };
    const { offers } = alpiq(doc);
    const base = offers['Alpiq - Base'];
    assert.equal(base.priceOverrides[6].bleu.HP, 19.9248);
    assert.equal(base.priceOverrides[7], undefined);
    assert.equal(base.dayTypes.bleu.HP, 19.7695);
    assert.equal(offers['Alpiq - Heures Creuses'].subscriptions[36], 53.88);
    items.find(it => it.y === y(36) && it.x === 40 && it.str === '53,88').str = '54,99';
    assert.throws(() => alpiq(doc), /36 kVA ambigu/);
});
