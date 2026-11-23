// Tests de reconcileOffer sur les formes introduites par les tarifs spot :
// dayTypes absent des deux côtés, comparaison feuille à feuille de
// spotFormula (scalaires et objets saisonniers { hiver, ete }).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcileOffer } from '../lib/reconcile.mjs';

const SPOT_DEF = {
    name: 'Test - Spot avec plafond saisonnier',
    lastUpdate: '2026-06-17',
    subscriptions: { 6: 21.0402, 9: 27.6276 },
    spotFormula: {
        turpe: { hiver: 6.32, ete: 1.49 },
        accise: 3.085,
        cap: { hiver: 25.00, ete: 14.17 },
        conformite: 1.00,
        marge: 0.80,
        prime: 0.70,
        tva: 1.20
    }
};

function spotOffer(overrides = {}) {
    return {
        subscriptions: { ...SPOT_DEF.subscriptions },
        spotFormula: {
            ...SPOT_DEF.spotFormula,
            turpe: { ...SPOT_DEF.spotFormula.turpe },
            cap: { ...SPOT_DEF.spotFormula.cap },
            ...overrides
        }
    };
}

test('offre spot identique : aucun changement, aucun problème', () => {
    const { changes, issues } = reconcileOffer(SPOT_DEF, spotOffer(), '2026-06-17');
    assert.deepEqual(changes, []);
    assert.deepEqual(issues, []);
});

test('spotFormula : changement scalaire et saisonnier détectés avec chemins imbriqués', () => {
    const offer = spotOffer({ marge: 0.90, cap: { hiver: 26.00, ete: 14.17 } });
    const { changes, issues } = reconcileOffer(SPOT_DEF, offer, '2026-09-01');
    assert.deepEqual(issues, []);
    assert.deepEqual(changes, [
        { path: ['spotFormula', 'cap', 'hiver'], old: 25.00, new: 26.00 },
        { path: ['spotFormula', 'marge'], old: 0.80, new: 0.90 },
        { path: ['lastUpdate'], old: '2026-06-17', new: '2026-09-01' }
    ]);
});

test('spotFormula : composante manquante ou saison inconnue -> problème structurel', () => {
    const missing = spotOffer();
    delete missing.spotFormula.prime;
    assert.ok(reconcileOffer(SPOT_DEF, missing, '2026-06-17').issues.length > 0);

    const badSeason = spotOffer({ turpe: { hiver: 6.32, printemps: 2 } });
    assert.ok(reconcileOffer(SPOT_DEF, badSeason, '2026-06-17')
        .issues.some(i => i.includes('spotFormula.turpe')));
});

test('dayTypes ou spotFormula présent d\'un seul côté -> problème structurel', () => {
    const withDayTypes = { ...spotOffer(), dayTypes: { bleu: { price: 10 } } };
    assert.ok(reconcileOffer(SPOT_DEF, withDayTypes, '2026-06-17')
        .issues.some(i => i.includes('dayTypes')));

    const withoutFormula = { subscriptions: { ...SPOT_DEF.subscriptions } };
    assert.ok(reconcileOffer(SPOT_DEF, withoutFormula, '2026-06-17')
        .issues.some(i => i.includes('spotFormula')));
});

test('tarif classique : dayTypes toujours comparés (non-régression)', () => {
    const def = {
        name: 'TEST', lastUpdate: '2026-01-01',
        subscriptions: { 6: 15.65 },
        dayTypes: { bleu: { price: 19.27 } }
    };
    const { changes } = reconcileOffer(def,
        { subscriptions: { 6: 15.65 }, dayTypes: { bleu: { price: 19.50 } } }, '2026-02-01');
    assert.deepEqual(changes, [
        { path: ['dayTypes', 'bleu', 'price'], old: 19.27, new: 19.50 },
        { path: ['lastUpdate'], old: '2026-01-01', new: '2026-02-01' }
    ]);
});
