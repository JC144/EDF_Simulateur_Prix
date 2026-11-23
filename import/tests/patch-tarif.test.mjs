import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patchTarifFile } from '../lib/patch-tarif.mjs';
import { loadDefsFromSource } from '../lib/revalidate.mjs';

// Fichier réaliste : deux blocs defineTarif, commentaires, priceOverrides.
const SOURCE = `// Grille EDF fictive pour les tests
defineTarif({
    name: "Test - Base", // offre de base
    offer_type: "TRV",
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "",
    price_url: "https://example.com/grille.pdf",
    subscriptions: { 3: 12.03, 6: 15.65, 9: 19.56 },
    dayTypes: { bleu: { price: 19.27 } },
    priceOverrides: { 3: { bleu: { price: 19.40 } }, 6: { bleu: { price: 19.40 } } },
    dayRule: { type: "constant", dayType: "bleu" }
});

/* second bloc : HP/HC */
defineTarif({
    name: "Test - HC",
    offer_type: "TRV",
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "",
    price_url: "https://example.com/grille.pdf",
    subscriptions: { 6: 15.79, 9: 19.71 },
    dayTypes: { bleu: { HP: 20.81, HC: 16.06 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: "custom"
});
`;

test('patch simple : abonnement + lastUpdate dans le bon bloc', () => {
    const { source, applied, failed } = patchTarifFile(SOURCE, 'Test - Base', [
        { path: ['subscriptions', '6'], old: 15.65, new: 15.99 },
        { path: ['lastUpdate'], old: '2026-02-01', new: '2026-07-18' },
    ]);
    assert.equal(failed.length, 0);
    assert.equal(applied.length, 2);
    assert.match(source, /subscriptions: \{ 3: 12.03, 6: 15.99, 9: 19.56 \}/);
    assert.match(source, /name: "Test - Base", \/\/ offre de base\n    offer_type: "TRV",\n    lastUpdate: "2026-07-18"/);
    // Le second bloc est intact (même lastUpdate d'origine).
    assert.match(source, /name: "Test - HC",\n    offer_type: "TRV",\n    lastUpdate: "2026-02-01"/);
});

test('subscriptionRule : ajout, nouvelle échéance et réouverture dans un fichier partagé', () => {
    const closed = { kind: 'closed', reason: 'Option « historique » réservée aux "anciens" clients' };
    const dated = { kind: 'expired', reason: 'Fin de la période', endDate: '2026-12-01', endInclusive: false };
    const change = (old, next) => [{ path: ['subscriptionRule'], old, new: next }];
    const name = 'Test - HC';
    for (const source of [SOURCE, SOURCE.replaceAll('\n', '\r\n')]) {
        const added = patchTarifFile(source, name, change(undefined, closed));
        assert.deepEqual(added.failed, []);
        const updated = patchTarifFile(added.source, name, change(closed, dated));
        assert.deepEqual(updated.failed, []);
        const [base, hc] = loadDefsFromSource(updated.source, 'tarifs.js');
        assert.equal(base.subscriptionRule, undefined);
        assert.deepEqual(structuredClone(hc.subscriptionRule), dated);
        assert.equal(patchTarifFile(updated.source, name, change(closed, undefined)).failed.length, 1);
        const reopened = patchTarifFile(updated.source, name, change(dated, undefined));
        assert.deepEqual(reopened.failed, []);
        assert.equal(reopened.source, source);
    }
});

test('patch HP/HC dans le second bloc uniquement', () => {
    const { source, failed } = patchTarifFile(SOURCE, 'Test - HC', [
        { path: ['dayTypes', 'bleu', 'HP'], old: 20.81, new: 21.02 },
        { path: ['subscriptions', '6'], old: 15.79, new: 16.02 },
    ]);
    assert.equal(failed.length, 0);
    assert.match(source, /dayTypes: \{ bleu: \{ HP: 21.02, HC: 16.06 \} \}/);
    assert.match(source, /subscriptions: \{ 6: 16.02, 9: 19.71 \}/);
    // Le priceOverrides du premier bloc n'a pas bougé.
    assert.match(source, /priceOverrides: \{ 3: \{ bleu: \{ price: 19.40 \} \}/);
});

test('patch priceOverrides imbriqué', () => {
    const { source, failed } = patchTarifFile(SOURCE, 'Test - Base', [
        { path: ['priceOverrides', '3', 'bleu', 'price'], old: 19.4, new: 19.55 },
    ]);
    assert.equal(failed.length, 0);
    assert.match(source, /priceOverrides: \{ 3: \{ bleu: \{ price: 19.55 \} \}, 6: \{ bleu: \{ price: 19.40 \} \} \}/);
});

test('refus si la valeur actuelle ne correspond pas', () => {
    const { source, applied, failed } = patchTarifFile(SOURCE, 'Test - Base', [
        { path: ['subscriptions', '6'], old: 99.99, new: 15.99 },
    ]);
    assert.equal(applied.length, 0);
    assert.equal(failed.length, 1);
    assert.match(failed[0].reason, /valeur actuelle/);
    assert.equal(source, SOURCE);
});

test('refus si le chemin est introuvable', () => {
    const { failed } = patchTarifFile(SOURCE, 'Test - HC', [
        { path: ['priceOverrides', '6', 'bleu', 'price'], old: 19.4, new: 19.55 },
    ]);
    assert.equal(failed.length, 1);
    assert.match(failed[0].reason, /introuvable/);
});

test('refus si le bloc nommé est introuvable', () => {
    const { failed } = patchTarifFile(SOURCE, 'Test - Inconnu', [
        { path: ['lastUpdate'], old: '2026-02-01', new: '2026-07-18' },
    ]);
    assert.equal(failed.length, 1);
    assert.match(failed[0].reason, /bloc defineTarif/);
});

test('un nom d\'offre apparaissant dans une chaîne ailleurs ne perturbe pas', () => {
    const tricky = SOURCE.replace('subscription_url: "",', 'subscription_url: "https://example.com/?q=defineTarif",');
    const { failed } = patchTarifFile(tricky, 'Test - Base', [
        { path: ['subscriptions', '3'], old: 12.03, new: 12.10 },
    ]);
    assert.equal(failed.length, 0);
});
