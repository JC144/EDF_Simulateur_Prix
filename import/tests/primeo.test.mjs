import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as primeo } from '../parsers/primeo.mjs';

test('Primeo : tableau TTC du fournisseur et palier supérieur aux puissances intermédiaires', () => {
    const doc = { sha256: 'e397868fbf985e7dfe702ce8077223a0e1ccde285e1ab96929b57a490807d2ab' };
    const { offers } = primeo(doc);
    const base = offers['Primeo Energie - Fixe Sereine - Base'];
    const hc = offers['Primeo Energie - Fixe Sereine - HP/HC'];
    assert.equal(base.subscriptions[7], 27.35);
    assert.deepEqual(base.priceOverrides[6].bleu, { price: 24.75 });
    assert.equal(hc.subscriptions[3], 21.16);
    assert.equal(hc.subscriptions[17], 43.33);
    assert.throws(() => primeo({ sha256: 'nouvelle édition' }), /Nouvelle édition/);
});
