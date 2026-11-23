import test from 'node:test';
import assert from 'node:assert/strict';
import { subscriptionCheck } from '../parsers/edf.mjs';

test('seule la mention de fermeture de l’option EJP dans sa grille signale son retrait', () => {
    const check = subscriptionCheck('https://example.org/Grille_prix_EJP.pdf');
    const doc = str => ({ pages: [{ items: [{ x: 0, y: 20, w: 30, str }] }] });
    assert.deepEqual(check(doc("L’option tarifaire EJP est en extinction et n'est plus disponible à la souscription."))[0].names, ['EDF - EJP']);
    assert.deepEqual(check(doc('Certaines puissances ne sont plus disponibles à la souscription.')), []);
    assert.equal(subscriptionCheck('https://example.org/Grille_prix_Tarif_Bleu.pdf'), null);
});
