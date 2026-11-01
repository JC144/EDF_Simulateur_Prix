import { test } from 'node:test';
import assert from 'node:assert';
import {
    buildCurrentOfferAbonnement, validateCurrentOffer, serializeOffer, parseOffer,
    dayTypesOf, DEFAULT_SPOT, CURRENT_OFFER_TITLE, migrateOffer, OFFER_VERSION
} from '../../scripts/core/currentOffer.js';
import { runSimulation } from '../../scripts/core/simulation.js';
import { installFreshRegistry } from '../helpers/legacyLoader.mjs';
import { defaultSettings } from '../helpers/settings.mjs';
import { makeFullDay } from '../helpers/makeDay.mjs';

// 1 kW constant = 24 kWh par jour. Dates : mardi 2024/03/05, samedi 2024/03/09
// (hiver), mardi 2024/07/09 (été).
const DATA = [makeFullDay('2024/03/05'), makeFullDay('2024/03/09'), makeFullDay('2024/07/09')];

function offer(overrides) {
    return {
        name: '', kva: 6, abonnement: 0.01, structure: 'unique', hours: 'single',
        weekendDays: [0, 6], seasonWeekend: false, window: null, prices: {},
        spot: structuredClone(DEFAULT_SPOT), hcRanges: null, ...overrides
    };
}

function simulate(o) {
    installFreshRegistry();
    const { calculatedMonths } = runSimulation({ ...defaultSettings(6), currentOffer: o }, DATA);
    const current = calculatedMonths.at(-1);
    assert.strictEqual(current.isCurrentOffer, true);
    return Object.fromEntries(current.allMonths.flatMap(m => m.days).map(d => [d.date, d]));
}

// Prix énergie d'un jour = prix - abonnement du jour : on isole l'énergie avec
// un abonnement quasi nul (0,01 €/mois) et une tolérance.
const energy = day => day.price;
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.01, `${actual} != ${expected}`);

test('Base : prix saisis en €/kWh, titre avec le nom', () => {
    installFreshRegistry();
    const abo = buildCurrentOfferAbonnement(offer({ name: ' Ma box ', prices: { base: 0.2 } }), 6);
    assert.strictEqual(abo.name, CURRENT_OFFER_TITLE + ' (Ma box)');
    assert.strictEqual(abo.prices[0].base.prixKwhHC, 20);
    const days = simulate(offer({ prices: { base: 0.2 } }));
    near(energy(days['2024/03/05']), 24 * 0.2);
});

test('HP/HC : plages des réglages (22-24h et 0-7h = 9 h creuses)', () => {
    const days = simulate(offer({ hours: 'hphc', prices: { base: { HP: 0.3, HC: 0.1 } } }));
    near(days['2024/03/05'].priceHC, 9 * 0.1);
    near(days['2024/03/05'].priceHP, 15 * 0.3);
});

test('Week-end : jours choisis facturés au tarif week-end', () => {
    const days = simulate(offer({ structure: 'weekend', prices: { base: 0.2, weekend: 0.1 } }));
    near(energy(days['2024/03/05']), 24 * 0.2);
    near(energy(days['2024/03/09']), 24 * 0.1); // samedi
});

test('Tempo : jour rouge du calendrier EDF au tarif rouge', () => {
    installFreshRegistry();
    const abo = buildCurrentOfferAbonnement(offer({
        structure: 'tempo', prices: { bleu: 0.1, blanc: 0.2, rouge: 0.7 }
    }), 6);
    const red = abo.specialDays.find(d => d.name === 'rouge').lastDays[0];
    const time = { hour: 12, minute: 0 };
    assert.strictEqual(abo.getDayType({ date: red }, time), 'rouge');
    assert.strictEqual(abo.getDayType({ date: '2024/07/09' }, time), 'bleu');
});

test('EJP : types bleu / rouge', () => {
    installFreshRegistry();
    const abo = buildCurrentOfferAbonnement(offer({ structure: 'ejp', prices: { bleu: 0.1, rouge: 0.5 } }), 6);
    assert.deepStrictEqual(Object.keys(abo.prices[0]).filter(k => k !== 'puissance' && k !== 'abonnement').sort(), ['bleu', 'rouge']);
});

test('Saisonnier avec week-end : hiver/été x semaine/week-end', () => {
    const o = offer({
        structure: 'season', seasonWeekend: true,
        prices: { hiver: 0.4, hiverWeekend: 0.3, ete: 0.2, eteWeekend: 0.1 }
    });
    assert.deepStrictEqual(dayTypesOf(o), ['hiver', 'hiverWeekend', 'ete', 'eteWeekend']);
    const days = simulate(o);
    near(energy(days['2024/03/05']), 24 * 0.4);
    near(energy(days['2024/03/09']), 24 * 0.3);
    near(energy(days['2024/07/09']), 24 * 0.2);
});

test('Fenêtre super creuse : 2h-6h au prix hsc', () => {
    const days = simulate(offer({
        window: { fromHour: 2, toHour: 6 }, prices: { base: 0.2, hsc: 0.05 }
    }));
    near(energy(days['2024/03/05']), 20 * 0.2 + 4 * 0.05);
});

test('Spot : formule par défaut, jours sans données en erreur', () => {
    installFreshRegistry();
    const abo = buildCurrentOfferAbonnement(offer({ structure: 'spot' }), 6);
    assert.strictEqual(typeof abo.spotPricesFor, 'function');
    assert.strictEqual(abo.spotPricesFor('2024/03/05').length >= 24, true);
});

test('validateCurrentOffer : champs vides ou prix invalide -> message, sinon null', () => {
    installFreshRegistry();
    assert.match(validateCurrentOffer(offer({ abonnement: NaN, prices: { base: 0.2 } }), 6), /Renseignez/);
    assert.match(validateCurrentOffer(offer({ prices: {} }), 6), /Renseignez/);
    assert.ok(validateCurrentOffer(offer({ prices: { base: 0 } }), 6), 'prix nul refusé par le moteur');
    assert.strictEqual(validateCurrentOffer(offer({ prices: { base: 0.2 } }), 6), null);
    assert.strictEqual(validateCurrentOffer(offer({ structure: 'spot' }), 6), null);
});

test('export / import : aller-retour sans perte', () => {
    const original = offer({
        name: 'Tempo maison', structure: 'tempo', hours: 'hphc',
        prices: { bleu: { HP: 0.16, HC: 0.13 }, blanc: { HP: 0.19, HC: 0.15 }, rouge: { HP: 0.7, HC: 0.16 } },
        hcRanges: [['22:00', '23:59'], ['00:00', '06:00'], ['00:00', '00:00']]
    });
    const restored = parseOffer(serializeOffer(original));
    assert.deepStrictEqual(restored, original);
});

test('import : fichiers invalides rejetés avec un message', () => {
    assert.throws(() => parseOffer('pas du json'), /JSON/);
    assert.throws(() => parseOffer('{"format":"autre"}'), /pas une offre/);
    assert.throws(() => parseOffer(JSON.stringify({ format: 'edf-simulateur-offre', version: 99, structure: 'unique' })), /plus récente/);
    assert.throws(() => parseOffer(JSON.stringify({ format: 'edf-simulateur-offre', version: 1, structure: 'zzz' })), /inconnu/);
});

test('format : la version courante est écrite dans le fichier exporté', () => {
    const file = JSON.parse(serializeOffer(offer({})));
    assert.strictEqual(file.format, 'edf-simulateur-offre');
    assert.strictEqual(file.version, OFFER_VERSION);
});

test('migrateOffer : enchaîne les migrations des anciennes versions, refuse les plus récentes', () => {
    const migrations = {
        1: raw => ({ ...raw, version: 2, abonnement: raw.prixAbo }),
        2: raw => ({ ...raw, version: 3, hours: raw.hphc ? 'hphc' : 'single' })
    };
    const migrated = migrateOffer({ version: 1, prixAbo: 12, hphc: true }, migrations, 3);
    assert.strictEqual(migrated.version, 3);
    assert.strictEqual(migrated.abonnement, 12);
    assert.strictEqual(migrated.hours, 'hphc');
    assert.throws(() => migrateOffer({ version: 4 }, migrations, 3), /plus récente/);
    assert.throws(() => migrateOffer({ version: 1 }, {}, 2), /non pris en charge/);
    assert.throws(() => migrateOffer({ version: 'x' }), /invalide/);
});
