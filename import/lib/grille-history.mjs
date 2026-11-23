import fs from 'node:fs';
import path from 'node:path';
import { syncFile } from './site-gen.mjs';

// Seules les valeurs publiées sur la fiche entrent dans l'archive. Les jours
// Tempo et les séries EPEX évoluent indépendamment des grilles tarifaires.
export function priceSnapshot(g) {
    const snapshot = {
        date: g.lastUpdate,
        subscriptions: Object.fromEntries(g.subscriptions.map(s => [s.kva, s.monthly])),
    };
    if (g.marketIndex) snapshot.marketIndex = g.marketIndex;
    if (g.kind === 'spot') return { ...snapshot, source: g.source, formula: g.formula };
    if (g.hc.mode === 'byDayType') {
        snapshot.hc = { mode: 'byDayType', byType: g.hc.byType.map(t => ({ day: t.badge?.id ?? null, text: t.text })) };
    } else if (g.hc.mode !== 'none') {
        snapshot.hc = g.hc;
    }
    const periods = {};
    for (const row of g.prices.groups[0].rows) {
        const info = {};
        if (row.badge) info.day = row.badge.id;
        if (row.window) info.window = row.window;
        if (Object.keys(info).length) periods[row.type] = info;
    }
    if (Object.keys(periods).length) snapshot.periods = periods;
    snapshot.groups = g.prices.groups.map(({ kvas, rows }) => ({
        kvas,
        rates: Object.fromEntries(rows.map(row => [row.type, row.cells])),
    }));
    return snapshot;
}

export function syncHistory(dir, slug, current, { check = false } = {}) {
    const file = path.join(dir, 'historique', slug + '.json');
    const versions = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
    const latest = versions.at(-1);
    if (latest?.date > current.date) {
        throw new Error(`${slug} : la grille du ${current.date} précède la dernière grille enregistrée (${latest.date}). Vérifier la date avant de régénérer.`);
    }
    if (latest?.date === current.date) versions.pop(); // Correction de la même grille.
    versions.push(current);
    // Une ligne par grille pour conserver un diff lisible lors d'une mise à jour.
    const content = '[\n' + versions.map(v => '  ' + JSON.stringify(v)).join(',\n') + '\n]\n';
    return { versions, change: syncFile(file, content, { check, eol: '\n' }) };
}
