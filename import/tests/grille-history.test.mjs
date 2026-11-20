import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syncHistory } from '../lib/grille-history.mjs';
import { renderPriceSections } from '../../scripts/ui/grillePrices.js';

const group = (kvas, single) => ({ kvas, rates: { bleu: { single } } });
const first = {
    date: '2025-08-01',
    subscriptions: { 3: 10, 6: 0, 9: 15 },
    groups: [group([3], 20), group([6, 9], 10)],
};
const second = {
    date: '2026-02-01',
    subscriptions: { 3: 10, 6: 12, 9: 16, 12: 20 },
    groups: [group([3, 6, 9, 12], 15)],
};

test('une grille se compare à puissance, période et bande identiques', () => {
    const html = renderPriceSections(second, first).join('\n');
    const prices = html.slice(html.indexOf('<h2>Prix du kWh</h2>'));
    assert.match(prices, /3 kVA<\/h3>[\s\S]*?-25,00\s%/);
    assert.match(prices, /6 et 9 kVA<\/h3>[\s\S]*?\+50,00\s%/);
    assert.match(prices, /12 kVA<\/h3>[\s\S]*?Nouveau/);
    assert.match(html, /Inchangé/);
    assert.match(html, /Écart non calculable/);
    assert.doesNotMatch(html, /Infinity|NaN/);
    const hpHc = { ...second, groups: [{ kvas: [3], rates: { bleu: { HP: 22, HC: 10 }, rouge: { single: 14 } } }] };
    const differentBands = renderPriceSections(hpHc, first).join('\n').split('<h2>Prix du kWh</h2>')[1];
    assert.equal(differentBands.match(/Nouveau/g).length, 3);
    assert.doesNotMatch(renderPriceSections(first).join('\n'), /tarif-change|Évolution depuis/);
});

test('la formule spot compare les composantes de chaque saison', () => {
    const formula = { turpe: { hiver: 10, ete: 5 }, cap: { hiver: 50, ete: 40 }, accise: 3, conformite: 1, marge: 2, prime: 1, tva: 1.2 };
    const before = { date: first.date, subscriptions: { 6: 10 }, formula, source: 'epex-fr' };
    const now = { ...before, date: second.date, formula: { ...formula, turpe: { hiver: 11, ete: 4 } } };
    const html = renderPriceSections(now, before).join('\n');
    assert.match(html, /TURPE \(acheminement\)[^\n]*\+10,00\s%[^\n]*-20,00\s%/);
});

test('la génération conserve la grille remplacée et corrige une version à date identique', t => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'edf-test-grille-'));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    const store = (grid, check = false) => syncHistory(dir, 'offre', grid, { check });
    assert.equal(store(first, true).change.status, 'outdated');
    assert.deepEqual(fs.readdirSync(dir), []);
    store(first);
    assert.equal(store(first).change.status, 'unchanged');
    store(second, true);
    assert.equal(store(first, true).change.status, 'unchanged');
    assert.deepEqual(store(second).versions, [first, second]);
    const correction = { ...second, subscriptions: { ...second.subscriptions, 6: 13 } };
    assert.deepEqual(store(correction).versions, [first, correction]);
    assert.throws(() => store(first), /précède la dernière grille/);
    assert.equal(store(correction, true).change.status, 'unchanged');
});

test('les archives publiées sont datées, ordonnées et couvrent les puissances de chaque abonnement', () => {
    const dir = new URL('../../tarifs/historique/', import.meta.url);
    for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.json'))) {
        const grids = JSON.parse(fs.readFileSync(new URL(file, dir), 'utf8'));
        const dates = grids.map(g => g.date);
        assert.deepEqual(dates, [...new Set(dates)].sort(), file);
        for (const [i, grid] of grids.entries()) {
            const label = file + ' ' + grid.date;
            assert.match(grid.date, /^\d{4}-\d{2}-\d{2}$/, label);
            const kvas = Object.keys(grid.subscriptions).map(Number);
            assert.ok(kvas.length && Object.values(grid.subscriptions).every(Number.isFinite), label);
            if (grid.groups) {
                assert.deepEqual(grid.groups.flatMap(g => g.kvas).sort((a, b) => a - b), kvas, label);
                for (const group of grid.groups) {
                    for (const cells of Object.values(group.rates)) {
                        assert.ok(Object.values(cells).every(Number.isFinite), label);
                    }
                }
            }
            assert.doesNotMatch(renderPriceSections(grid, grids[i - 1]).join('\n'), /NaN|undefined|Infinity/, label);
        }
    }
});
