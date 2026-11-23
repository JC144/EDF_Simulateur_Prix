import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from '../lib/tarif-defs.mjs';

test('suppression en aperçu, puis par tarif et par fournisseur sur un dépôt isolé', t => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tarif-remove-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    function write(file, value) {
        fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        fs.writeFileSync(path.join(root, file), value);
    }
    const read = file => fs.readFileSync(path.join(root, file), 'utf8');
    const exists = file => fs.existsSync(path.join(root, file));
    function run(script, ...args) {
        return spawnSync(process.execPath, [path.join(root, 'import', script), ...args], { encoding: 'utf8' });
    }
    function ok(script, ...args) {
        const result = run(script, ...args);
        assert.equal(result.status, 0, result.stderr);
        return result.stdout;
    }

    for (const dir of ['import/lib', 'import/tools', 'scripts/utils', 'scripts/ui', 'components',
        'scripts/tarifs-lib/define-tarif.js', 'import/remove.mjs']) {
        fs.cpSync(path.join(REPO_ROOT, dir), path.join(root, dir), { recursive: true });
    }
    const grid = 'https://particuliers.alpiq.fr/prix.pdf';
    const oldGrid = 'https://particuliers.alpiq.fr/ancienne.pdf';
    const otherGrid = 'https://particulier.edf.fr/autre.pdf';
    const def = (name, url, calendar) => 'defineTarif(' + JSON.stringify({
        name, price_url: url, subscription_url: url, offer_type: 'Marché', lastUpdate: '2026-11-01',
        isCommunity: true, subscriptions: { 6: 15 },
        dayTypes: calendar ? { bleu: { price: 20 }, rouge: { price: 30 } } : { bleu: { price: 20 } },
        dayRule: calendar ? { type: 'calendar', calendar, default: 'bleu' } : { type: 'constant', dayType: 'bleu' },
    }) + ');\n';
    const a = 'Alpiq - A', b = 'Alpiq - B', other = 'EDF - Témoin';
    const file = 'scripts/tarifs/alpiq/grilles.js', otherFile = 'scripts/tarifs/edf/grille.js';
    const sibling = '// Commentaire de B\n' + def(b, grid);
    const dataFile = 'scripts/tarifs-lib/calendars/jours.js';
    write(dataFile, 'defineCalendar("commun", { rouge: { days: ["2026/01/01"] } });\n');
    write(file, def(a, grid, 'commun') + '\n' + sibling);
    write(otherFile, def(other, otherGrid, 'commun'));
    write('scripts/tarifs-manifest.js', 'export const TARIF_SCRIPTS = [\n'
        + ['scripts/tarifs-lib/define-tarif.js', dataFile, file, otherFile].map(f => '    "' + f + '",\n').join('') + '];\n');
    write('index.html', 'avant\n<!-- TARIFS-LIST:BEGIN --><!-- TARIFS-LIST:END -->\naprès');
    write('sitemap.xml', '<!-- TARIF-PAGES:BEGIN --><!-- TARIF-PAGES:END -->');
    write('import/manifest.json', JSON.stringify({ [grid]: {}, [oldGrid]: {}, [otherGrid]: {} }));
    write('import/cache/abcd1234-prix.pdf', 'PDF');
    write('import/fixtures/alpiq/prix.expected.json', JSON.stringify({ offers: { [a]: {}, [b]: {} } }));
    write('import/parsers/alpiq.mjs', '');
    write('import/tests/alpiq.test.mjs', '');
    write('tests/tarifs/alpiq-a.test.mjs', '');
    write('tests/golden/contracts-community.json', JSON.stringify([a, b, other].map(name => ({ name }))));
    write('tests/golden/monthly-6.json', JSON.stringify({ [a]: 1, [b]: 2, [other]: 3 }));
    const section = 'tools/gen-tarifs-section.mjs', pages = 'tools/gen-tarif-pages.mjs';
    ok(section);
    ok(pages);

    const before = read(file);
    assert.match(ok('remove.mjs', '--tarif', a, '--dry-run'), /alpiq-a\.html/);
    for (const args of [[], ['--provider', '../'], ['--tarif', 'Alpiq'], ['--provider', 'edf', '--tarif', a],
        ['--tarif', a, '--tarif', b], ['--tarif', a, '--apply', '--dry-run']]) {
        assert.notEqual(run('remove.mjs', ...args).status, 0);
    }
    // Une erreur tardive de préparation doit laisser intacte la définition.
    write('tests/golden/invalide.json', '{');
    assert.notEqual(run('remove.mjs', '--tarif', a, '--apply').status, 0);
    assert.equal(read(file), before);
    assert.ok(exists('tarifs/historique/alpiq-a.json'));
    fs.unlinkSync(path.join(root, 'tests/golden/invalide.json'));

    ok('remove.mjs', '--tarif', 'alpiq-a', '--apply');
    assert.equal(read(file), sibling);
    assert.ok(read('scripts/tarifs-manifest.js').includes(file));
    for (const f of ['tarifs/alpiq-a.html', 'tarifs/historique/alpiq-a.json', 'tests/tarifs/alpiq-a.test.mjs']) {
        assert.equal(exists(f), false, f);
    }
    const shared = ['import/cache/abcd1234-prix.pdf', 'import/fixtures/alpiq/prix.expected.json',
        'import/parsers/alpiq.mjs', 'import/tests/alpiq.test.mjs'];
    for (const f of shared) assert.ok(exists(f), f);
    assert.deepEqual(Object.keys(JSON.parse(read('import/fixtures/alpiq/prix.expected.json')).offers), [b]);
    assert.ok(Object.hasOwn(JSON.parse(read('import/manifest.json')), grid));
    ok(section, '--check');
    ok(pages, '--check');

    ok('remove.mjs', '--provider', 'alpiq', '--apply');
    for (const f of [...shared, file, 'tarifs/alpiq-b.html', 'tarifs/historique/alpiq-b.json',
        'scripts/tarifs/alpiq', 'import/fixtures/alpiq']) assert.equal(exists(f), false, f);
    assert.ok(!read('scripts/tarifs-manifest.js').includes(file));
    assert.deepEqual(Object.keys(JSON.parse(read('import/manifest.json'))), [otherGrid]);
    assert.deepEqual(JSON.parse(read('tests/golden/contracts-community.json')), [{ name: other }]);
    assert.deepEqual(JSON.parse(read('tests/golden/monthly-6.json')), { [other]: 3 });
    assert.equal(read(otherFile), def(other, otherGrid, 'commun'));
    assert.ok(exists(dataFile));
    ok(section, '--check');
    ok(pages, '--check');

    ok('remove.mjs', '--tarif', other, '--apply');
    assert.equal(exists(dataFile), false);
    assert.ok(!read('scripts/tarifs-manifest.js').includes(dataFile));
    ok(section, '--check');
    ok(pages, '--check');
});
