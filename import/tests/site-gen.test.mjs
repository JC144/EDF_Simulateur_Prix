// Tests des générateurs de HTML statique : modèle de grille (buildGrille) sur
// des définitions types, rendu des pages (renderPage), et contrôle « site
// généré à jour » sur le dépôt réel (substitut de CI : relancer
// `npm run gen` après toute modification de tarif).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from '../lib/tarif-defs.mjs';
import { formatMonths, formatIntervals, buildGrille, renderPage, run as runPages } from '../tools/gen-tarif-pages.mjs';
import { run as runSection } from '../tools/gen-tarifs-section.mjs';

// Construit les abonnements avec la vraie librairie defineTarif (display,
// validation) à partir de définitions inline.
function build(defs, calendars = {}) {
    const sandbox = { abonnements: [], console };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    const lib = fs.readFileSync(path.join(REPO_ROOT, 'scripts/tarifs-lib/define-tarif.js'), 'utf8');
    new vm.Script(lib).runInContext(context);
    for (const [name, days] of Object.entries(calendars)) sandbox.defineCalendar(name, days);
    for (const def of defs) {
        const { file, ...rest } = def;
        sandbox.defineTarif(rest);
    }
    return { abonnements: sandbox.abonnements, calendars: sandbox.TarifCalendars };
}

function grilleOf(def, calendars) {
    const built = build([def], calendars);
    const warnings = [];
    const grille = buildGrille(def, built.abonnements[0].display, built.calendars, warnings);
    assert.deepEqual(warnings, []);
    return grille;
}

const META = {
    offer_type: 'Marché',
    lastUpdate: '2026-08-01',
    isCommunity: false,
    subscription_url: 'https://exemple.fr/offre',
    price_url: 'https://exemple.fr/grille.pdf',
};

const SUBS = { 3: 12.13, 6: 15.86, 9: 19.88, 12: 23.76, 36: 53.88 };

test('formatMonths : séquences cycliques et élision', () => {
    assert.equal(formatMonths([11, 12, 1, 2, 3]), 'de novembre à mars');
    assert.equal(formatMonths([4, 5, 6, 7, 8, 9, 10]), 'd’avril à octobre');
    assert.equal(formatMonths([6]), 'en juin');
    assert.equal(formatMonths([1, 3]), 'en janvier et mars');
    assert.equal(formatMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), 'toute l’année');
});

test('formatIntervals : fusion à minuit, journée entière, vide', () => {
    assert.equal(formatIntervals([[1320, 1440], [0, 360]]), '22h00 – 06h00');
    assert.equal(formatIntervals([[0, 480], [780, 1080], [1200, 1440]]), '13h00 – 18h00, 20h00 – 08h00');
    assert.equal(formatIntervals([[0, 1440]]), 'toute la journée');
    assert.equal(formatIntervals([], 'aucune heure creuse'), 'aucune heure creuse');
});

test('buildGrille : prix unique avec priceOverrides groupés par puissance', () => {
    const g = grilleOf({
        ...META, file: 'scripts/tarifs/edf/x.js', name: 'EDF - Test Base',
        subscriptions: SUBS,
        dayTypes: { bleu: { price: 19.85 } },
        priceOverrides: { 3: { bleu: { price: 20.01 } }, 6: { bleu: { price: 20.01 } } },
        dayRule: { type: 'constant', dayType: 'bleu' },
    });
    assert.equal(g.kind, 'grid');
    assert.equal(g.provider, 'EDF');
    assert.equal(g.slug, 'edf-test-base');
    assert.equal(g.prices.hasHpHc, false);
    assert.deepEqual(g.prices.groups.map(gr => gr.kvaLabel), ['3 et 6 kVA', '9 à 36 kVA']);
    assert.deepEqual(g.prices.groups.map(gr => gr.rows[0].cells), [{ single: 20.01 }, { single: 19.85 }]);
    assert.equal(g.hc.mode, 'none');
    assert.equal(g.subscriptions[0].yearly, 145.56);
});

test('buildGrille : calendrier (Tempo) avec report de veille', () => {
    const g = grilleOf({
        ...META, file: 'scripts/tarifs/edf/x.js', name: 'EDF - Test Tempo',
        subscriptions: { 6: 15.8 },
        dayTypes: { bleu: { HP: 16.54, HC: 13.56 }, rouge: { HP: 72.95, HC: 16.15 } },
        dayRule: { type: 'calendar', default: 'bleu', calendar: 'cal-test', previousDayBefore: 6 },
        hcRanges: [{ from: '22:00', to: '24:00' }, { from: '00:00', to: '06:00' }],
    }, { 'cal-test': { rouge: { numberOfDays: 22, monthBegin: 11, monthEnd: 3, days: [] } } });
    assert.deepEqual(g.prices.groups[0].rows.map(r => r.badge.label), ['Bleu', 'Rouge']);
    assert.deepEqual(g.hc, { mode: 'fixed', text: '22h00 – 06h00' });
    const text = g.ruleLines.join(' ');
    assert.match(text, /22 jours par an, placés par le fournisseur entre novembre et mars/);
    assert.match(text, /Avant 6&nbsp;h/);
});

test('buildGrille : saison + sous-types horaires (Zen Estival), plage inerte ignorée', () => {
    const g = grilleOf({
        ...META, file: 'scripts/tarifs/edf/x.js', name: 'EDF - Test Saisons',
        subscriptions: { 6: 15.8 },
        dayTypes: { hiver: { HP: 27.22, HC: 21.31 }, hiverSC: { price: 19.92 }, ete: { HP: 15.88, HC: 14.05 }, eteSC: { price: 9.91 } },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } },
            previousDayBefore: 6,
            hourSubTypes: {
                ete: [{ fromHour: 11, toHour: 18, dayType: 'eteSC' }],
                hiver: [{ fromHour: 22, toHour: 24, dayType: 'hiverSC' }, { fromHour: 0, toHour: 7, dayType: 'hiverSC' }],
            },
        },
        hcRanges: {
            byDayType: {
                hiver: [{ from: '11:00', to: '18:00' }],
                hiverSC: [{ from: '22:00', to: '24:00' }, { from: '00:00', to: '07:00' }],
                ete: [{ from: '22:00', to: '00:00' }, { from: '00:00', to: '07:00' }],
                eteSC: [{ from: '11:00', to: '18:00' }],
            },
        },
    });
    const rows = g.prices.groups[0].rows;
    const sc = rows.find(r => r.type === 'hiverSC');
    assert.equal(sc.badge.label, 'Hiver');
    assert.equal(sc.band, 'Super creuses');
    assert.equal(sc.window, '22h00 – 07h00');
    assert.deepEqual(sc.cells, { single: 19.92 });
    assert.equal(rows.find(r => r.type === 'hiver').window, 'autres heures');
    // Les types à prix unique ne figurent pas dans les heures creuses.
    assert.deepEqual(g.hc.byType.map(t => [t.type, t.text]), [['hiver', '11h00 – 18h00'], ['ete', '00h00 – 07h00']]);
});

test('buildGrille : saison × week-end et semaine avec jour Zen+', () => {
    const season = grilleOf({
        ...META, file: 'scripts/tarifs/enercoop/x.js', name: 'Enercoop - Test',
        subscriptions: { 6: 15.8 },
        dayTypes: { hiver: { HP: 31.6, HC: 22.3 }, hiverWeekend: { HP: 31.6, HC: 22.3 }, ete: { HP: 19.5, HC: 13.8 }, eteWeekend: { HP: 19.5, HC: 13.8 } },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [11, 12, 1, 2, 3], weekendType: 'hiverWeekend' }, ete: { months: [4, 5, 6, 7, 8, 9, 10], weekendType: 'eteWeekend' } },
            weekendDays: [0, 6],
            previousDayBefore: 6,
        },
        hcRanges: { byDayType: { hiver: [], ete: [{ from: '11:00', to: '17:00' }], hiverWeekend: [{ from: '00:00', to: '24:00' }], eteWeekend: [{ from: '00:00', to: '24:00' }] } },
    });
    assert.deepEqual(season.hc.byType.map(t => t.text), ['aucune heure creuse', 'toute la journée', '11h00 – 17h00', 'toute la journée']);
    assert.match(season.ruleLines.join(' '), /le samedi et le dimanche/);

    const weekly = grilleOf({
        ...META, file: 'scripts/tarifs/edf/x.js', name: 'EDF - Test WE',
        subscriptions: { 6: 15.8 },
        dayTypes: { bleu: { price: 22.59 }, weekend: { price: 16.91 } },
        dayRule: { type: 'weekly', default: 'bleu', days: { weekend: [0, 6] }, userDaySetting: 'jourZenPlus' },
    });
    const text = weekly.ruleLines.join(' ');
    assert.match(text, /chaque samedi et dimanche/);
    assert.match(text, /jour Zen\+/);
});

test('buildGrille + renderPage : tarif spot', () => {
    const def = {
        ...META, file: 'scripts/tarifs/sobry/x.js', name: 'Sobry - Test',
        subscriptions: { 6: 21.0402 },
        dayRule: { type: 'spot', source: 'epex-fr' },
        spotFormula: { turpe: { hiver: 6.32, ete: 1.49 }, accise: 3.085, cap: { hiver: 33.33, ete: 33.33 }, conformite: 1, marge: 0.8, prime: 0.2, tva: 1.2 },
    };
    const sandbox = { abonnements: [], console };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    new vm.Script(fs.readFileSync(path.join(REPO_ROOT, 'scripts/tarifs-lib/define-tarif.js'), 'utf8')).runInContext(context);
    sandbox.defineSpotPrices('epex-fr', { '2026/01/01': new Array(24).fill(50) });
    const { file, ...rest } = def;
    sandbox.defineTarif(rest);
    const g = buildGrille(def, sandbox.abonnements[0].display, {}, []);
    assert.equal(g.kind, 'spot');
    const html = renderPage(g);
    assert.match(html, /EPEX FR day-ahead/);
    assert.match(html, /× 1,20/);
    assert.match(html, /3,085/);
    assert.match(html, /21,0402/);
    assert.doesNotMatch(html, /<h2>Heures creuses<\/h2>/);
});

test('renderPage : métadonnées, liens conditionnels, échappement, déterminisme', () => {
    const base = {
        ...META, file: 'scripts/tarifs/mint/x.js', name: 'Mint Énergie - Classic & Green',
        isCommunity: true,
        subscriptions: { 6: 15.8 },
        dayTypes: { bleu: { HP: 20.91, HC: 16.46 } },
        dayRule: { type: 'constant', dayType: 'bleu' },
        hcRanges: 'custom',
    };
    const html = renderPage(grilleOf(base));
    assert.equal(renderPage(grilleOf(base)), html, 'rendu déterministe');
    assert.doesNotMatch(html, /undefined|NaN|\[object/);
    assert.match(html, /<h1>Mint Énergie – Classic &amp; Green<\/h1>/);
    assert.match(html, /<time datetime="2026-08-01">1er août 2026<\/time>/);
    assert.match(html, /data-last-update="2026-08-01"/);
    assert.match(html, /class="alert alert-warning tarif-stale" role="alert" hidden>/);
    assert.match(html, /Grille tarifaire officielle \(PDF\)/);
    assert.match(html, /Page de l’offre sur le site du fournisseur/);
    assert.match(html, /Tarif communautaire/);
    assert.match(html, /compteur Linky/);
    assert.match(html, /<link rel="canonical" href="https:\/\/comparateur-abonnements-electricite\.fr\/tarifs\/mint-energie-classic-green\.html">/);
    assert.match(html, /<script type="module" src="\.\.\/scripts\/tarif-page\.js"><\/script>/);
    assert.doesNotMatch(html, /<script>/, 'aucun script inline (CSP)');

    const other = renderPage(grilleOf({ ...base, name: 'Mint Énergie - Autre', subscription_url: '', price_url: 'https://exemple.fr/annexes' }));
    assert.doesNotMatch(other, /Page de l’offre/);
    assert.match(other, /Grille tarifaire officielle<\/a>/);
});

test('site généré à jour (sinon : cd import && npm run gen)', () => {
    const stale = [...runSection({ check: true }).changes, ...runPages({ check: true }).changes]
        .filter(c => c.status !== 'unchanged');
    assert.deepEqual(stale, []);
});
