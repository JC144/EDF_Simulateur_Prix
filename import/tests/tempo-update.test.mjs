import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { REPO_ROOT } from '../lib/tarif-defs.mjs';
import { CALENDARS, serializeCalendarFile } from '../lib/tempo-data.mjs';

test('l’import synchronise uniquement les listes Tempo, même si le calendrier est déjà à jour', t => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tempo-update-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    for (const file of ['import/tempo-update.mjs', 'import/lib/tempo-data.mjs', 'import/lib/tarif-defs.mjs',
        'scripts/tarifs-lib/define-tarif.js']) {
        fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        fs.copyFileSync(path.join(REPO_ROOT, file), path.join(root, file));
    }
    const calendar = path.join(root, CALENDARS.TEMPO.relativePath);
    const golden = path.join(root, 'tests/golden/contracts-edf.json');
    fs.mkdirSync(path.dirname(calendar), { recursive: true });
    fs.mkdirSync(path.dirname(golden), { recursive: true });
    const calendars = [CALENDARS.TEMPO.relativePath, CALENDARS.EJP.relativePath];
    fs.writeFileSync(path.join(root, 'scripts/tarifs-manifest.js'), JSON.stringify(calendars));
    const initialCalendar = serializeCalendarFile(CALENDARS.TEMPO, { rouge: ['2026/01/07'], blanc: ['2026/01/08'] });
    fs.writeFileSync(calendar, initialCalendar);
    fs.writeFileSync(path.join(root, CALENDARS.EJP.relativePath), serializeCalendarFile(CALENDARS.EJP, { rouge: ['2026/01/08'] }));
    const expected = [
        { name: 'EDF - EJP', specialDays: [{ name: 'rouge', lastDays: ['2025/12/01'] }] },
        { name: 'EDF - Tempo', prices: [{ HP: 17 }], specialDays: [
            { name: 'blanc', numberOfDays: 43, lastDays: [] },
            { name: 'rouge', numberOfDays: 22, lastDays: ['2025/12/12'] },
        ] },
    ];
    const original = JSON.stringify(expected, null, 2) + '\n';
    fs.writeFileSync(golden, original);

    // La réponse corrige le 8 janvier de blanc en rouge sur la fenêtre demandée.
    const mockApi = 'data:text/javascript,' + encodeURIComponent(`globalThis.fetch = async () => Response.json({
        content: { options: [{ option: 'TEMPO', calendrier: [{ dateApplication: '2026-01-08', statut: 'TEMPO_ROUGE' }] }] }
    })`);
    const run = (...args) => execFileSync(process.execPath,
        ['--import', mockApi, 'import/tempo-update.mjs', ...args], { cwd: root, encoding: 'utf8' });
    const tempo = ['--option', 'TEMPO', '--to', '2026-01-08'];
    run('--option', 'EJP', '--to', '2026-01-08');
    assert.equal(fs.readFileSync(golden, 'utf8'), original);
    assert.match(run(...tempo, '--dry-run'), /à synchroniser/);
    assert.equal(fs.readFileSync(golden, 'utf8'), original);

    run(...tempo);
    const [white, red] = expected[1].specialDays;
    white.lastDays = ['2026/01/08'];
    red.lastDays = ['2026/01/07'];
    assert.deepEqual(JSON.parse(fs.readFileSync(golden, 'utf8')), expected);
    assert.doesNotMatch(run(...tempo), /synchronisée/);

    const correction = [...tempo, '--from', '2026-01-08'];
    assert.match(run(...correction, '--dry-run'), /à synchroniser/);
    assert.equal(fs.readFileSync(calendar, 'utf8'), initialCalendar);
    assert.deepEqual(JSON.parse(fs.readFileSync(golden, 'utf8')), expected);
    run(...correction);
    white.lastDays = [];
    red.lastDays.push('2026/01/08');
    assert.deepEqual(JSON.parse(fs.readFileSync(golden, 'utf8')), expected);
    assert.equal(fs.readFileSync(calendar, 'utf8'), serializeCalendarFile(CALENDARS.TEMPO, { rouge: red.lastDays, blanc: [] }));
    assert.doesNotMatch(run(...correction), /synchronisée/);
});
