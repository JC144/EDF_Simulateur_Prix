// Tests des métadonnées des pages de grille (scripts/utils/tarifMeta.js) :
// slugs (stables, uniques sur tous les tarifs chargés) et péremption 6 mois.
import { test } from 'node:test';
import assert from 'node:assert';
import { tarifSlug, tarifPagePath, isStale, STALE_MONTHS, isSubscriptionDisabled, todayInParis } from '../../scripts/utils/tarifMeta.js';
import { loadAbonnements } from '../helpers/legacyLoader.mjs';

test('souscription : fermeture et échéances inclusives ou exclusives à minuit à Paris', () => {
    const before = todayInParis(new Date('2026-11-30T22:59:59Z'));
    const midnight = todayInParis(new Date('2026-11-30T23:00:00Z'));
    const deadline = { kind: 'expired', endDate: '2026-12-01', endInclusive: false };
    assert.equal(isSubscriptionDisabled(undefined, midnight), false);
    assert.equal(isSubscriptionDisabled({ kind: 'closed' }, before), true);
    assert.equal(isSubscriptionDisabled(deadline, before), false);
    assert.equal(isSubscriptionDisabled(deadline, midnight), true);
    assert.equal(isSubscriptionDisabled({ ...deadline, endInclusive: true }, midnight), false);
    assert.equal(isSubscriptionDisabled({ ...deadline, endInclusive: true }, '2026-12-02'), true);
});

test('tarifSlug : accents, ponctuation, tirets', () => {
    assert.strictEqual(tarifSlug('EDF - Bleu Heures Creuses'), 'edf-bleu-heures-creuses');
    assert.strictEqual(tarifSlug('Enercoop - Flexibilité - nuit & week-end'), 'enercoop-flexibilite-nuit-week-end');
    assert.strictEqual(tarifSlug("TotalEnergie - Charge'Heures"), 'totalenergie-charge-heures');
    assert.strictEqual(tarifSlug('Mint Énergie - Classic & Green'), 'mint-energie-classic-green');
    assert.strictEqual(tarifSlug('  --Été--  '), 'ete');
});

test('tarifPagePath : chemin relatif à la racine du site', () => {
    assert.strictEqual(tarifPagePath('EDF - Tempo'), 'tarifs/edf-tempo.html');
});

test('tarifSlug : unique et bien formé pour tous les tarifs chargés', () => {
    const names = loadAbonnements().map(a => a.name);
    const slugs = names.map(tarifSlug);
    for (const slug of slugs) {
        assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    assert.deepStrictEqual(dupes, [], 'deux tarifs produiraient la même page');
});

test('isStale : limite à 6 mois jour pour jour', () => {
    assert.strictEqual(STALE_MONTHS, 6);
    assert.strictEqual(isStale('2026-02-01', new Date(2026, 7, 1)), false, 'pile 6 mois : encore valide');
    assert.strictEqual(isStale('2026-02-01', new Date(2026, 7, 2)), true, 'lendemain : périmée');
    assert.strictEqual(isStale('2026-02-01', new Date(2026, 6, 31)), false);
    assert.strictEqual(isStale('2026-09-15', new Date(2026, 9, 1)), false);
});

test('isStale : fin de mois et changement d\'année', () => {
    // 31 août + 6 mois = 3 mars (février 2027 n'a que 28 jours).
    assert.strictEqual(isStale('2026-08-31', new Date(2027, 2, 3)), false);
    assert.strictEqual(isStale('2026-08-31', new Date(2027, 2, 4)), true);
    assert.strictEqual(isStale('2025-12-15', new Date(2026, 5, 16)), true);
});
