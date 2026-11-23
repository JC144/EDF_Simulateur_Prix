import test from 'node:test';
import assert from 'node:assert/strict';
import { subscriptionCheck } from '../parsers/plenitude.mjs';

test('la période publiée inclut ou exclut son dernier jour pour les deux options de la grille', () => {
    const check = subscriptionCheck();
    const doc = end => ({ pages: [{ items: [
        { x: 0, y: 40, w: 30, str: "Offre de fourniture d'électricité Pleniweb 1 an" },
        { x: 0, y: 20, w: 30, str: 'Grille tarifaire de référence pour toute souscription du 01/10/2026 au 17/11/2026 ' + end },
    ] }] });
    const expected = ['Plenitude - Pleniweb 1 an - Base', 'Plenitude - Pleniweb 1 an - HP/HC'];
    assert.deepEqual(check(doc('non inclus'), '2026-11-16'), []);
    assert.deepEqual(check(doc('non inclus'), '2026-11-17')[0].names, expected);
    assert.deepEqual(check(doc('inclus'), '2026-11-17'), []);
    assert.deepEqual(check(doc('inclus'), '2026-11-18')[0].names, expected);
});
