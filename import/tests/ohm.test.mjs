import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoverUrl } from '../parsers/ohm.mjs';

test('Prix Réservé retrouve la grille électrique sur la page de réservation commune au gaz', async t => {
    const site = 'https://ohm-energie.com';
    const current = site + '/grilles/elec/2026/11/ELEC-Prix_Reserve.pdf';
    const next = '/grilles/elec/2026/12/ELEC-Prix_Reserve.pdf';
    t.mock.method(globalThis, 'fetch', async page => {
        assert.equal(page, site + '/prix-reserve-electricite-et-gaz');
        return new Response(`<a href="/grilles/gaz/2026/12/GAZ-Prix_Reserve.pdf">Gaz</a><a href="${next}">Électricité</a>`);
    });
    assert.equal(await discoverUrl(current), site + next);
});
