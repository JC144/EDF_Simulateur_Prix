import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { groupByPriceUrl, REPO_ROOT } from '../lib/tarif-defs.mjs';
import { resolveParser } from '../lib/registry.mjs';
import { tarifSlug } from '../../scripts/utils/tarifMeta.js';
import { catalogStatus } from '../lib/subscriptions.mjs';

test('le catalogue compte chaque option et applique les fermetures uniquement aux fiches concernées', () => {
    const offer = (name, file, link = 'souscrire') => ({ name, file, price_url: 'grille', subscription_url: link });
    const offers = [
        offer('Base', 'scripts/tarifs/edf/base.js'), offer('HP/HC', 'scripts/tarifs/edf/hc.js'),
        offer('Fermée', 'scripts/tarifs/engie/offres.js', ''), offer('Sans lien', 'scripts/tarifs/engie/offres.js', ''),
    ];
    const manifest = { grille: { subscriptionRules: [
        { names: ['Fermée', 'Ancienne fiche retirée'], kind: 'closed', reason: 'Fermeture confirmée' },
        { names: ['HP/HC'], kind: 'expired', reason: 'Période expirée', endDate: '2026-12-01', endInclusive: true },
    ] } };
    const disabled = [{ name: 'Fermée', reason: 'Fermeture confirmée' }, { name: 'Sans lien', reason: 'Aucun lien de souscription' }];
    assert.deepEqual(catalogStatus(manifest, offers, '2026-12-01'), { total: 4, active: 2, providers: 2, disabled });
    const next = catalogStatus(manifest, offers, '2026-12-02');
    assert.equal(next.active, 1);
    assert.deepEqual(next.disabled.map(d => d.name), ['Fermée', 'HP/HC', 'Sans lien']);
    assert.deepEqual(catalogStatus(manifest, []), { total: 0, active: 0, providers: 0, disabled: [] });
});

test('le bilan global en échec donne une commande par offre des grilles 404/410 et écarte les pannes 503', async t => {
    const grids = [];
    for (const [url, defs] of groupByPriceUrl()) {
        const source = await resolveParser(url);
        if (source?.parser && !source.parser.discoverUrl && !source.parser.checkInputs) grids.push({ url, defs });
        if (grids.length === 2) break;
    }
    if (grids.length < 2) return t.skip('Deux grilles directes nécessaires pour exercer les deux réponses HTTP.');
    const urls = grids.map(grid => grid.url);
    const stub = `globalThis.fetch = async url => {
        const statuses = new Map(${JSON.stringify([[urls[0], 404], [urls[1], 410]])});
        return new Response(null, { status: statuses.get(String(url)) ?? 503 });
    };`;
    const result = spawnSync(process.execPath, ['import/update-all.mjs', '--only', 'tarifs', '--check-only'], {
        cwd: REPO_ROOT, encoding: 'utf8',
        env: { ...process.env, INIT_CWD: REPO_ROOT, NODE_OPTIONS: '--import=data:text/javascript;base64,' + Buffer.from(stub).toString('base64') },
    });
    assert.equal(result.status, 1, result.stderr);
    const blocks = result.stdout.split('--- Disponibilité des offres ---');
    assert.equal(blocks.length, 2, result.stdout);
    assert.match(blocks[0], /--- Synthèse ---/);
    assert.match(blocks[1], /Retraits à confirmer/);
    assert.match(blocks[1], /HTTP 404/);
    assert.match(blocks[1], /HTTP 410/);
    const commands = blocks[1].split(/\r?\n/).map(line => line.trim()).filter(line => line.startsWith('node '));
    const expected = grids.flatMap(({ defs }) => defs.map(d => 'node import/remove.mjs --tarif ' + tarifSlug(d.name) + ' --apply'));
    assert.deepEqual(commands.sort(), expected.sort());
    const status = spawnSync(process.execPath, ['import/status.mjs'], { cwd: REPO_ROOT, encoding: 'utf8' });
    assert.equal(status.status, 0, status.stderr);
    const summary = status.stdout.split(/\r?\n/)[0];
    assert.match(summary, /offres? actives? sur \d+ tarifs? · \d+ fournisseurs?$/);
    assert.equal(result.stdout.trimEnd().split(/\r?\n/).at(-1), summary);
});
