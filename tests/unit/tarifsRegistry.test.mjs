import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { getAvailablePowers, getOfferChoices, loadTarifs } from '../../scripts/core/tarifsRegistry.js';
import { createTarifSandbox, loadAbonnements } from '../helpers/legacyLoader.mjs';

test('les choix de l’assistant correspondent aux grilles pour chaque puissance', () => {
    const all = loadAbonnements();
    const powers = [...new Set(all.flatMap(abo => abo.prices.map(p => p.puissance)))].sort((a, b) => a - b);
    assert.deepEqual(getAvailablePowers(), powers);
    for (const kva of powers) {
        const offers = all.filter(abo => abo.prices.some(p => p.puissance === kva));
        assert.deepEqual(getOfferChoices(kva).map(o => o.name), Array.from(offers, o => o.name));
    }
});

test('chargement EDF puis communautaire : reprise sur erreur et partage des scripts', async t => {
    const sandbox = createTarifSandbox({ files: [] });
    globalThis.window = sandbox;
    const requests = [];
    let offline = true;
    globalThis.document = {
        createElement: () => ({ remove() {} }),
        head: {
            appendChild(script) {
                const url = new URL(script.src);
                requests.push(url.pathname);
                queueMicrotask(() => {
                    if (offline && url.pathname.endsWith('/define-tarif.js')) {
                        script.onerror();
                        return;
                    }
                    vm.runInContext(readFileSync(url, 'utf8'), sandbox);
                    script.onload();
                });
            }
        }
    };
    t.after(() => {
        delete globalThis.window;
        delete globalThis.document;
    });

    const settings = { kva: 9, includeCommunity: false };
    await assert.rejects(loadTarifs(settings), /define-tarif/);
    assert.ok(requests.every(url => !url.includes('/calendars/')));
    offline = false;
    const [edf, concurrent] = await Promise.all([loadTarifs(settings), loadTarifs(settings)]);
    assert.deepEqual(concurrent, edf);
    assert.ok(edf.length > 0 && edf.every(abo => abo.name.startsWith('EDF - ')));
    assert.ok(!requests.some(url => url.includes('/spot/') || url.includes('/tarifs/frank/')));

    const previousCount = requests.length;
    const currentOffer = getOfferChoices(9).find(o => o.eligibility).name;
    const community = await loadTarifs({ ...settings, includeCommunity: true, currentOffer });
    assert.ok(requests.some(url => url.includes('/spot/')));
    assert.ok(requests.slice(previousCount).every(url => !requests.slice(0, previousCount).includes(url)));
    const expected = loadAbonnements().filter(abo => abo.prices.some(p => p.puissance === 9)
        && (!abo.eligibility || abo.name === currentOffer));
    assert.deepEqual(community.map(abo => abo.name), Array.from(expected, abo => abo.name));
    assert.equal(new Set(requests).size, requests.length - 1, 'seul le script en échec est redemandé');
});
