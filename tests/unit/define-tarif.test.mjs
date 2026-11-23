// Tests de la factory declarative defineTarif / defineCalendar
// (scripts/tarifs-lib/define-tarif.js) : contrat généré et validation.
import { test } from 'node:test';
import assert from 'node:assert';
import { createTarifSandbox } from '../helpers/legacyLoader.mjs';

const LIB = ['scripts/tarifs-lib/define-tarif.js'];

function freshSandbox() {
    return createTarifSandbox({ files: LIB });
}

// Les objets créés dans le contexte vm ont les prototypes d'un autre realm :
// round-trip JSON avant deepStrictEqual.
function plain(value) {
    return JSON.parse(JSON.stringify(value));
}

// Définition de base valide (tarif HP/HC constant), à surcharger dans les tests.
function validDef(overrides = {}) {
    return {
        name: 'TEST - Tarif',
        offer_type: 'Marché',
        lastUpdate: '2026-02-01',
        isCommunity: true,
        subscription_url: 'https://example.org/souscrire',
        price_url: 'https://example.org/grille.pdf',
        subscriptions: { 6: 15.65, 9: 19.56 },
        dayTypes: { bleu: { HP: 20.65, HC: 15.79 } },
        dayRule: { type: 'constant', dayType: 'bleu' },
        hcRanges: [{ from: '22:00', to: '24:00' }, { from: '00:00', to: '06:00' }],
        ...overrides
    };
}

function expectError(def, fragment, sandbox = freshSandbox()) {
    assert.throws(() => sandbox.defineTarif(def), (error) => {
        assert.match(error.message, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
            `message d'erreur attendu contenant « ${fragment} », reçu : ${error.message}`);
        return true;
    });
    assert.ok(sandbox.tarifDefinitionErrors.length > 0, 'l\'erreur doit être accumulée dans tarifDefinitionErrors');
}

test('constant : contrat legacy généré (prices, hc, flags, getDayType)', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef());

    assert.strictEqual(sandbox.abonnements.length, 1);
    assert.strictEqual(sandbox.abonnements[0], abo);
    assert.deepStrictEqual(plain(abo).prices, [
        { puissance: 6, abonnement: 15.65, bleu: { prixKwhHP: 20.65, prixKwhHC: 15.79 } },
        { puissance: 9, abonnement: 19.56, bleu: { prixKwhHP: 20.65, prixKwhHC: 15.79 } }
    ]);
    assert.deepStrictEqual(plain(abo).hc, [
        { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
        { start: { hour: 0, minute: 0 }, end: { hour: 6, minute: 0 } }
    ]);
    assert.strictEqual(abo.hasHCCustom, false);
    assert.strictEqual(abo.hasSpecialDaysCustom, false);
    assert.deepStrictEqual(plain(abo).specialDays, []);
    assert.strictEqual(abo.getDayType({ date: '2024/07/15' }, { hour: 12, minute: 0 }), 'bleu');
});

test('prix unique { price } : hc = journée entière, prixKwhHC seul, hcRanges omis', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: { bleu: { price: 19.27 } },
        hcRanges: undefined
    }));

    assert.deepStrictEqual(plain(abo).prices[0].bleu, { prixKwhHC: 19.27 });
    assert.deepStrictEqual(plain(abo).hc, [{ start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } }]);
});

test('priceOverrides : surcharge par puissance (cas EDF Bleu 3/6 kVA)', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        subscriptions: { 3: 12.03, 6: 15.65, 9: 19.56 },
        dayTypes: { bleu: { price: 19.27 } },
        priceOverrides: { 3: { bleu: { price: 19.40 } }, 6: { bleu: { price: 19.40 } } },
        hcRanges: undefined
    }));

    assert.deepStrictEqual(plain(abo).prices.map(p => p.bleu.prixKwhHC), [19.40, 19.40, 19.27]);
});

test('mélange { price } et { HP, HC } avec hcRanges : { price } = tarification HC seule', () => {
    // Cas Zen Estival : les types super creuses n'ont qu'un prix HC.
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: { bleu: { HP: 20, HC: 10 }, bleuSC: { price: 8 } },
        dayRule: { type: 'season', seasons: { bleu: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } }, hourSubTypes: { bleu: [{ fromHour: 2, toHour: 6, dayType: 'bleuSC' }] } },
        hcRanges: { byDayType: { bleu: [], bleuSC: [{ from: '02:00', to: '06:00' }] } }
    }));

    assert.deepStrictEqual(plain(abo).prices[0].bleuSC, { prixKwhHC: 8 });
    assert.deepStrictEqual(plain(abo).prices[0].bleu, { prixKwhHP: 20, prixKwhHC: 10 });
});

test('hcRanges "custom" : hasHCCustom true et hc vide (rempli par la simulation)', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({ hcRanges: 'custom' }));

    assert.strictEqual(abo.hasHCCustom, true);
    assert.deepStrictEqual(plain(abo).hc, []);
});

test('weekly : specialDays = jours de semaine, getDayType via getDay()', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: { bleu: { price: 20.38 }, weekend: { price: 15.38 } },
        dayRule: { type: 'weekly', default: 'bleu', days: { weekend: [0, 6] } },
        hcRanges: undefined
    }));

    assert.deepStrictEqual(plain(abo).specialDays, [0, 6]);
    assert.strictEqual(abo.hasSpecialDaysCustom, false);
    assert.strictEqual(abo.getDayType({ date: '2026/07/11' }), 'weekend'); // samedi
    assert.strictEqual(abo.getDayType({ date: '2026/07/13' }), 'bleu');    // lundi

    // La personnalisation utilisateur pousse un jour dans specialDays (simulation.js)
    abo.specialDays.push(1);
    assert.strictEqual(abo.getDayType({ date: '2026/07/13' }), 'weekend');
});

test('weekly + userDaySetting : hasSpecialDaysCustom true', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: { bleu: { price: 21.33 }, weekend: { price: 16.04 } },
        dayRule: { type: 'weekly', default: 'bleu', days: { weekend: [0, 6] }, userDaySetting: 'jourZenPlus' },
        hcRanges: undefined
    }));
    assert.strictEqual(abo.hasSpecialDaysCustom, true);
});

test('calendar : specialDays au format legacy, règle "avant Nh = veille" optionnelle', () => {
    const sandbox = freshSandbox();
    sandbox.defineCalendar('test-cal', {
        rouge: { numberOfDays: 22, monthBegin: 11, monthEnd: 3, days: ['2026/01/07'] },
        blanc: { numberOfDays: 43, monthBegin: 10, monthEnd: 6, days: ['2026/01/08'] }
    });

    const withRule = sandbox.defineTarif(validDef({
        name: 'TEST - Avec veille',
        dayTypes: { bleu: { HP: 16.12, HC: 13.25 }, rouge: { HP: 70.60, HC: 15.75 }, blanc: { HP: 18.71, HC: 14.99 } },
        dayRule: { type: 'calendar', default: 'bleu', calendar: 'test-cal', previousDayBefore: 6 }
    }));

    assert.deepStrictEqual(plain(withRule.specialDays), [
        { name: 'rouge', numberOfDays: 22, monthBegin: 11, monthEnd: 3, lastDays: ['2026/01/07'] },
        { name: 'blanc', numberOfDays: 43, monthBegin: 10, monthEnd: 6, lastDays: ['2026/01/08'] }
    ]);
    assert.strictEqual(withRule.getDayType({ date: '2026/01/07' }, { hour: 12, minute: 0 }), 'rouge');
    assert.strictEqual(withRule.getDayType({ date: '2026/01/08' }, { hour: 5, minute: 30 }), 'rouge', 'avant 6h : couleur de la veille');
    assert.strictEqual(withRule.getDayType({ date: '2026/01/08' }, { hour: 6, minute: 0 }), 'blanc');
    assert.strictEqual(withRule.getDayType({ date: '2026/01/07' }, { hour: 24, minute: 0 }), 'rouge', '24h n\'est pas < 6h');

    const withoutRule = sandbox.defineTarif(validDef({
        name: 'TEST - Sans veille',
        dayTypes: { bleu: { HP: 17.81, HC: 17.81 }, rouge: { HP: 34.40, HC: 17.81 }, blanc: { HP: 18.71, HC: 14.99 } },
        dayRule: { type: 'calendar', default: 'bleu', calendar: 'test-cal' }
    }));
    assert.strictEqual(withoutRule.getDayType({ date: '2026/01/08' }, { hour: 5, minute: 0 }), 'blanc', 'pas de report sans previousDayBefore');
});

test('season : saisons par mois, sous-types horaires, hcRanges byDayType', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: {
            hiver: { HP: 26.27, HC: 20.62 },
            hiverSC: { HP: 19.28, HC: 19.28 },
            ete: { HP: 15.22, HC: 13.04 },
            eteSC: { HP: 9.87, HC: 9.87 }
        },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } },
            previousDayBefore: 6,
            hourSubTypes: {
                ete: [{ fromHour: 11, toHour: 18, dayType: 'eteSC' }],
                hiver: [
                    { fromHour: 22, toHour: 24, dayType: 'hiverSC' },
                    { fromHour: 0, toHour: 7, dayType: 'hiverSC' }
                ]
            }
        },
        hcRanges: {
            byDayType: {
                hiver: [{ from: '11:00', to: '18:00' }],
                hiverSC: [{ from: '22:00', to: '24:00' }, { from: '00:00', to: '07:00' }],
                ete: [{ from: '00:00', to: '07:00' }],
                eteSC: [{ from: '11:00', to: '18:00' }]
            }
        }
    }));

    assert.deepStrictEqual(plain(abo).hc, []);
    assert.deepStrictEqual(plain(abo).hcByDayType.hiverSC, [
        { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
        { start: { hour: 0, minute: 0 }, end: { hour: 7, minute: 0 } }
    ]);

    const at = (hour, minute = 0) => ({ hour, minute });
    assert.strictEqual(abo.getDayType({ date: '2024/10/31' }, at(9)), 'ete');
    assert.strictEqual(abo.getDayType({ date: '2024/11/01' }, at(9)), 'hiver');
    assert.strictEqual(abo.getDayType({ date: '2024/11/01' }, at(3)), 'ete', 'avant 6h : saison de la veille (mais heure brute pour les sous-types)');
    // La fenêtre { fromHour, toHour } couvre les relevés ]fromHour ; toHour]
    // (le relevé étiqueté T couvre ]T-pas ; T], comme le classement HP/HC).
    assert.strictEqual(abo.getDayType({ date: '2024/07/15' }, at(11)), 'ete', 'relevé 11:00 avant la fenêtre 11-18');
    assert.strictEqual(abo.getDayType({ date: '2024/07/15' }, at(11, 30)), 'eteSC');
    assert.strictEqual(abo.getDayType({ date: '2024/07/15' }, at(18)), 'eteSC', 'relevé 18:00 dans la fenêtre 11-18');
    assert.strictEqual(abo.getDayType({ date: '2024/12/15' }, at(22)), 'hiver', 'relevé 22:00 avant la fenêtre 22-24');
    assert.strictEqual(abo.getDayType({ date: '2024/12/15' }, at(22, 30)), 'hiverSC');
    assert.strictEqual(abo.getDayType({ date: '2024/12/15' }, at(24)), 'hiverSC', 'minuit=24, dans la fenêtre 22-24');
});

test('constant + hourSubTypes : fenêtre horaire sur jour constant (type Happy / super creuses)', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: { base: { HP: 21.62, HC: 16.51 }, hsc: { price: 12.61 } },
        dayRule: {
            type: 'constant',
            dayType: 'base',
            hourSubTypes: [{ fromHour: 2, toHour: 6, dayType: 'hsc' }]
        },
        hcRanges: [{ from: '23:00', to: '24:00' }, { from: '00:00', to: '07:00' }]
    }));

    const at = (hour, minute = 0) => ({ hour, minute });
    const day = { date: '2024/12/15' };
    assert.strictEqual(abo.getDayType(day, at(1, 30)), 'base');
    assert.strictEqual(abo.getDayType(day, at(2)), 'base', 'relevé 2:00 avant la fenêtre 2-6');
    assert.strictEqual(abo.getDayType(day, at(2, 30)), 'hsc');
    assert.strictEqual(abo.getDayType(day, at(5, 30)), 'hsc');
    assert.strictEqual(abo.getDayType(day, at(6)), 'hsc', 'relevé 6:00 dans la fenêtre 2-6');
    assert.strictEqual(abo.getDayType(day, at(6, 30)), 'base');
    assert.strictEqual(abo.getDayType(day, at(24)), 'base', 'minuit=24 hors fenêtre');
    assert.deepStrictEqual(plain(abo).specialDays, []);
});

test('season + weekendType : saison × week-end sur la même date décalée (type Enercoop)', () => {
    const sandbox = freshSandbox();
    const abo = sandbox.defineTarif(validDef({
        dayTypes: {
            hiver: { HP: 31.04, HC: 22.90 },
            hiverWeekend: { HP: 31.04, HC: 22.90 },
            ete: { HP: 19.367, HC: 13.715 },
            eteWeekend: { HP: 19.367, HC: 13.715 }
        },
        dayRule: {
            type: 'season',
            seasons: {
                hiver: { months: [11, 12, 1, 2, 3], weekendType: 'hiverWeekend' },
                ete: { months: [4, 5, 6, 7, 8, 9, 10], weekendType: 'eteWeekend' }
            },
            weekendDays: [0, 6],
            previousDayBefore: 6
        },
        hcRanges: {
            byDayType: {
                hiver: [{ from: '00:00', to: '07:00' }, { from: '13:00', to: '16:00' }],
                ete: [{ from: '11:00', to: '17:00' }],
                hiverWeekend: [{ from: '00:00', to: '24:00' }],
                eteWeekend: [{ from: '00:00', to: '24:00' }]
            }
        }
    }));

    const at = (hour, minute = 0) => ({ hour, minute });
    assert.strictEqual(abo.getDayType({ date: '2024/12/07' }, at(12)), 'hiverWeekend'); // samedi
    assert.strictEqual(abo.getDayType({ date: '2024/12/09' }, at(12)), 'hiver');        // lundi
    assert.strictEqual(abo.getDayType({ date: '2024/12/09' }, at(3)), 'hiverWeekend', 'lundi avant 6h : la veille est un dimanche');
    assert.strictEqual(abo.getDayType({ date: '2024/12/07' }, at(3)), 'hiver', 'samedi avant 6h : la veille est un vendredi');
    assert.strictEqual(abo.getDayType({ date: '2024/11/01' }, at(3)), 'ete', 'changement de saison : avant 6h, saison de la veille');
    assert.strictEqual(abo.getDayType({ date: '2024/07/13' }, at(24)), 'eteWeekend', '24h : pas de report, dimanche');
});

test('season + calendarOverride : jours de calendrier prioritaires sur la saison (type OctoTempo)', () => {
    const sandbox = freshSandbox();
    sandbox.defineCalendar('tempo-test', {
        rouge: { numberOfDays: 22, monthBegin: 11, monthEnd: 3, days: ['2024/12/09', '2024/07/15'] }
    });
    const abo = sandbox.defineTarif(validDef({
        dayTypes: {
            rouge: { HP: 64.69, HC: 15.75 },
            hiver: { HP: 18.71, HC: 15.75 },
            ete: { HP: 15.75, HC: 13.25 }
        },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } },
            previousDayBefore: 6,
            calendarOverride: { calendar: 'tempo-test', types: ['rouge'] }
        },
        hcRanges: {
            byDayType: {
                rouge: [{ from: '00:00', to: '07:00' }],
                hiver: [{ from: '00:00', to: '07:00' }],
                ete: [{ from: '00:00', to: '07:00' }]
            }
        }
    }));

    const at = (hour, minute = 0) => ({ hour, minute });
    assert.strictEqual(abo.getDayType({ date: '2024/12/09' }, at(12)), 'rouge', 'jour rouge prioritaire sur la saison');
    assert.strictEqual(abo.getDayType({ date: '2024/07/15' }, at(12)), 'rouge', 'jour rouge aussi en été');
    assert.strictEqual(abo.getDayType({ date: '2024/12/10' }, at(3)), 'rouge', 'avant 6h : la veille est rouge');
    assert.strictEqual(abo.getDayType({ date: '2024/12/10' }, at(6)), 'hiver', 'à 6h : retour à la saison');
    assert.strictEqual(abo.getDayType({ date: '2024/12/09' }, at(3)), 'hiver', 'avant 6h un jour rouge : la veille est ordinaire');
    assert.strictEqual(abo.getDayType({ date: '2024/12/09' }, at(24)), 'rouge', '24h : pas de report');
});

test('une pointe saisonnière prime le week-end et le jour férié, une date inconnue est indisponible', () => {
    const sandbox = freshSandbox();
    const spec = validDef({
        dayTypes: { saison: { HP: 2, HC: 1 }, weekend: { HP: 1, HC: 1 }, pointe: { HP: 4, HC: 1 } },
        dayRule: { type: 'season', weekendDays: [0, 6], includePublicHolidays: true, peakCalendar: 'alertes',
            seasons: { saison: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], weekendType: 'weekend', peakType: 'pointe' } } },
    });
    expectError(spec, 'dayRule.peakCalendar');
    sandbox.defineCalendar('alertes', { pointe: { days: ['2026/05/14', '2026/12/26'] }, normal: { days: ['2026/12/25'] } });
    const abo = sandbox.defineTarif(spec);
    const atNoon = date => abo.getDayType({ date }, { hour: 12, minute: 0 });
    assert.strictEqual(atNoon('2026/05/14'), 'pointe');
    assert.strictEqual(atNoon('2026/12/26'), 'pointe');
    assert.strictEqual(atNoon('2026/12/25'), 'weekend');
    assert.strictEqual(atNoon('2026/12/27'), null);
});

test('validation : calendarOverride', () => {
    const defWith = overrides => validDef({
        dayTypes: { rouge: { HP: 2, HC: 1 }, hiver: { HP: 2, HC: 1 } },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
            calendarOverride: { calendar: 'tempo-test', types: ['rouge'] },
            ...overrides
        },
        hcRanges: { byDayType: { rouge: [], hiver: [] } }
    });
    const withCalendar = () => {
        const sandbox = freshSandbox();
        sandbox.defineCalendar('tempo-test', { rouge: { days: ['2024/12/09'] } });
        return sandbox;
    };

    expectError(defWith({ calendarOverride: { calendar: 'nexiste-pas', types: ['rouge'] } }), 'calendrier inconnu', withCalendar());
    expectError(defWith({ calendarOverride: { calendar: 'tempo-test', types: ['blanc'] } }), 'absent du calendrier', withCalendar());
    expectError(defWith({ calendarOverride: { calendar: 'tempo-test', types: [] } }), 'calendarOverride', withCalendar());
    expectError(defWith({
        hourSubTypes: { hiver: [{ fromHour: 2, toHour: 6, dayType: 'rouge' }] }
    }), 'non supporté en même temps que hourSubTypes', withCalendar());
});

test('validation : hourSubTypes sur constant et weekendType sur season', () => {
    expectError(validDef({
        dayTypes: { base: { HP: 20, HC: 10 }, hsc: { price: 8 } },
        dayRule: { type: 'constant', dayType: 'base', hourSubTypes: [{ fromHour: 6, toHour: 2, dayType: 'hsc' }] }
    }), 'fromHour < toHour');
    expectError(validDef({
        dayRule: { type: 'constant', dayType: 'bleu', hourSubTypes: [{ fromHour: 2, toHour: 6, dayType: 'inconnu' }] }
    }), 'absent de dayTypes');
    // weekendDays manquant quand weekendType est utilisé
    expectError(validDef({
        dayTypes: { hiver: { HP: 2, HC: 1 }, hiverWE: { HP: 2, HC: 1 } },
        dayRule: { type: 'season', seasons: { hiver: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], weekendType: 'hiverWE' } } },
        hcRanges: { byDayType: { hiver: [], hiverWE: [] } }
    }), 'dayRule.weekendDays');
    // weekendDays sans weekendType
    expectError(validDef({
        dayTypes: { hiver: { HP: 2, HC: 1 } },
        dayRule: { type: 'season', seasons: { hiver: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } }, weekendDays: [0, 6] },
        hcRanges: { byDayType: { hiver: [] } }
    }), 'sans effet sans weekendType');
    // hourSubTypes + weekendType interdits ensemble
    expectError(validDef({
        dayTypes: { hiver: { HP: 2, HC: 1 }, hiverWE: { HP: 2, HC: 1 }, hiverSC: { price: 1 } },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], weekendType: 'hiverWE' } },
            weekendDays: [0, 6],
            hourSubTypes: { hiver: [{ fromHour: 2, toHour: 6, dayType: 'hiverSC' }] }
        },
        hcRanges: { byDayType: { hiver: [], hiverWE: [], hiverSC: [] } }
    }), 'non supporté en même temps que weekendType');
});

test('display : table de présentation dérivée de chaque règle', () => {
    const sandbox = freshSandbox();

    // constant { HP, HC } : pas de badge, bandes HP/HC
    const constant = sandbox.defineTarif(validDef({ name: 'TEST - constant' }));
    assert.deepStrictEqual(plain(constant.display), {
        types: { bleu: { day: null, bands: { HP: 'HP', HC: 'HC' } } },
        dayOrder: [],
        bandOrder: ['HP', 'HC']
    });

    // constant { price } : bande unique nommée comme le type
    const single = sandbox.defineTarif(validDef({
        name: 'TEST - prix unique',
        dayTypes: { bleu: { price: 19.27 } },
        hcRanges: undefined
    }));
    assert.deepStrictEqual(plain(single.display), {
        types: { bleu: { day: null, bands: { HP: 'bleu', HC: 'bleu' } } },
        dayOrder: [],
        bandOrder: ['bleu']
    });

    // constant + hourSubTypes (type Charge'Heures) : la fenêtre est une bande
    const subTypes = sandbox.defineTarif(validDef({
        name: 'TEST - hsc',
        dayTypes: { base: { HP: 21.62, HC: 16.51 }, hsc: { price: 12.61 } },
        dayRule: { type: 'constant', dayType: 'base', hourSubTypes: [{ fromHour: 2, toHour: 6, dayType: 'hsc' }] },
        hcRanges: [{ from: '00:00', to: '07:00' }]
    }));
    assert.deepStrictEqual(plain(subTypes.display), {
        types: {
            base: { day: null, bands: { HP: 'HP', HC: 'HC' } },
            hsc: { day: null, bands: { HP: 'hsc', HC: 'hsc' } }
        },
        dayOrder: [],
        bandOrder: ['HP', 'HC', 'hsc']
    });

    // weekly : deux jours distincts
    const weekly = sandbox.defineTarif(validDef({
        name: 'TEST - weekly',
        dayTypes: { bleu: { price: 20.38 }, weekend: { price: 15.38 } },
        dayRule: { type: 'weekly', default: 'bleu', days: { weekend: [0, 6] } },
        hcRanges: undefined
    }));
    assert.deepStrictEqual(plain(weekly.display), {
        types: {
            bleu: { day: 'bleu', bands: { HP: 'bleu', HC: 'bleu' } },
            weekend: { day: 'weekend', bands: { HP: 'weekend', HC: 'weekend' } }
        },
        dayOrder: ['bleu', 'weekend'],
        bandOrder: ['bleu', 'weekend']
    });

    // calendar : le défaut et les types du calendrier sont des jours
    sandbox.defineCalendar('display-cal', { rouge: { days: ['2026/01/07'] } });
    const calendar = sandbox.defineTarif(validDef({
        name: 'TEST - calendar',
        dayTypes: { bleu: { HP: 16, HC: 13 }, rouge: { HP: 70, HC: 15 } },
        dayRule: { type: 'calendar', default: 'bleu', calendar: 'display-cal' }
    }));
    assert.deepStrictEqual(plain(calendar.display), {
        types: {
            bleu: { day: 'bleu', bands: { HP: 'HP', HC: 'HC' } },
            rouge: { day: 'rouge', bands: { HP: 'HP', HC: 'HC' } }
        },
        dayOrder: ['bleu', 'rouge'],
        bandOrder: ['HP', 'HC']
    });

    // season + hourSubTypes (type vert_HSC) : saisons = jours, fenêtres = bandes
    const season = sandbox.defineTarif(validDef({
        name: 'TEST - season',
        dayTypes: {
            hpEte: { price: 17.80 },
            hcEte: { price: 16.24 },
            hpHiver: { price: 20.91 },
            hscHiver: { price: 16.24 }
        },
        dayRule: {
            type: 'season',
            seasons: { hcEte: { months: [4, 5, 6, 7, 8, 9, 10] }, hscHiver: { months: [11, 12, 1, 2, 3] } },
            hourSubTypes: {
                hcEte: [{ fromHour: 7, toHour: 23, dayType: 'hpEte' }],
                hscHiver: [{ fromHour: 7, toHour: 23, dayType: 'hpHiver' }]
            }
        },
        hcRanges: undefined
    }));
    assert.deepStrictEqual(plain(season.display), {
        types: {
            hpEte: { day: 'hcEte', bands: { HP: 'hpEte', HC: 'hpEte' } },
            hcEte: { day: 'hcEte', bands: { HP: 'hcEte', HC: 'hcEte' } },
            hpHiver: { day: 'hscHiver', bands: { HP: 'hpHiver', HC: 'hpHiver' } },
            hscHiver: { day: 'hscHiver', bands: { HP: 'hscHiver', HC: 'hscHiver' } }
        },
        dayOrder: ['hcEte', 'hscHiver'],
        bandOrder: ['hpEte', 'hcEte', 'hpHiver', 'hscHiver']
    });

    // season + calendarOverride (type OctoTempo) : le jour calendrier s'ajoute
    const octo = sandbox.defineTarif(validDef({
        name: 'TEST - override',
        dayTypes: { rouge: { HP: 64, HC: 15 }, hiver: { HP: 18, HC: 15 }, ete: { HP: 15, HC: 13 } },
        dayRule: {
            type: 'season',
            seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } },
            calendarOverride: { calendar: 'display-cal', types: ['rouge'] }
        },
        hcRanges: { byDayType: { rouge: [], hiver: [], ete: [] } }
    }));
    assert.deepStrictEqual(plain(octo.display).dayOrder, ['hiver', 'ete', 'rouge']);
    assert.deepStrictEqual(plain(octo.display).types.rouge, { day: 'rouge', bands: { HP: 'HP', HC: 'HC' } });
});

test('validation : métadonnées manquantes ou invalides', () => {
    expectError(validDef({ name: '' }), 'name manquant');
    expectError(validDef({ lastUpdate: '01/02/2026' }), 'lastUpdate');
    expectError(validDef({ isCommunity: undefined }), 'isCommunity');
    expectError(validDef({ price_url: '' }), 'price_url');
});

test('validation : grilles de prix', () => {
    expectError(validDef({ subscriptions: {} }), 'subscriptions manquant');
    expectError(validDef({ subscriptions: { 6: '15.65' } }), 'subscriptions[6]');
    expectError(validDef({ dayTypes: { bleu: { HP: 20.65 } } }), 'clés attendues');
    expectError(validDef({ priceOverrides: { 12: { bleu: { HP: 1, HC: 1 } } } }), 'puissance absente de subscriptions');
});

test('validation : dayRule', () => {
    expectError(validDef({ dayRule: { type: 'inconnu' } }), 'dayRule.type inconnu');
    expectError(validDef({ dayRule: { type: 'constant', dayType: 'rouge' } }), 'absent de dayTypes');
    expectError(validDef({
        dayTypes: { bleu: { HP: 20, HC: 10 }, oublie: { HP: 1, HC: 1 } },
        dayRule: { type: 'constant', dayType: 'bleu' }
    }), 'jamais utilisé par dayRule');
    expectError(validDef({
        dayRule: { type: 'calendar', default: 'bleu', calendar: 'nexiste-pas' }
    }), 'calendrier inconnu');
    expectError(validDef({
        dayTypes: { hiver: { HP: 2, HC: 1 }, ete: { HP: 2, HC: 1 } },
        dayRule: { type: 'season', seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9] } } },
        hcRanges: { byDayType: { hiver: [], ete: [] } }
    }), 'mois 10 couvert par aucune saison');
});

// ------------------------------------------------------------------ //
//  Tarifs au prix spot                                               //
// ------------------------------------------------------------------ //

// Formule spot avec plafond saisonnier (centimes/kWh hors TVA, tva = multiplicateur).
function validSpotDef(overrides = {}) {
    return validDef({
        dayTypes: undefined,
        hcRanges: undefined,
        dayRule: { type: 'spot', source: 'spot-test' },
        spotFormula: {
            turpe: { hiver: 6.32, ete: 1.49 },
            accise: 3.085,
            cap: { hiver: 25.00, ete: 14.17 },
            conformite: 1.00,
            marge: 0.80,
            prime: 0.70,
            tva: 1.20
        },
        ...overrides
    });
}

function spotSandbox() {
    const sandbox = freshSandbox();
    sandbox.defineSpotPrices('spot-test', {
        // Janvier (hiver) : 100 EUR/MWh constant ; juin (été) : dont un prix
        // négatif et un pic au-dessus du plafond.
        '2026/01/15': Array(24).fill(100),
        '2026/06/15': [-5, 100, 400, ...Array(93).fill(50)]
    });
    return sandbox;
}

test('spot : contrat généré (prices, hc, display, getDayType)', () => {
    const sandbox = spotSandbox();
    const abo = sandbox.defineTarif(validSpotDef());

    // Pas de grille par type de jour : abonnement seul.
    assert.deepStrictEqual(plain(abo).prices, [
        { puissance: 6, abonnement: 15.65 },
        { puissance: 9, abonnement: 19.56 }
    ]);
    // Prix unique : tout est classé HC via la plage pleine journée.
    assert.deepStrictEqual(plain(abo).hc, [{ start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } }]);
    assert.strictEqual(abo.hasHCCustom, false);
    assert.strictEqual(abo.hasSpecialDaysCustom, false);
    assert.deepStrictEqual(plain(abo).specialDays, []);
    assert.strictEqual(abo.getDayType({ date: '2026/01/15' }, { hour: 12, minute: 0 }), 'spot');
    assert.deepStrictEqual(plain(abo).display, {
        types: { spot: { day: null, bands: { HP: 'spot', HC: 'spot' } } },
        dayOrder: [],
        bandOrder: ['spot']
    });
});

test('spot : spotPricesFor applique la formule, le plafond et les saisons', () => {
    const sandbox = spotSandbox();
    const abo = sandbox.defineTarif(validSpotDef());

    // Hiver, 100 EUR/MWh : (min(10 + 6.32 + 3.085, 25) + 1 + 0.8 + 0.7) * 1.2
    const hiver = abo.spotPricesFor('2026/01/15');
    assert.strictEqual(hiver.length, 24);
    assert.ok(Math.abs(hiver[0] - 26.286) < 1e-9);

    const ete = abo.spotPricesFor('2026/06/15');
    assert.strictEqual(ete.length, 96);
    // Été, -5 EUR/MWh : (-0.5 + 1.49 + 3.085) + 1 + 0.8 + 0.7 puis TVA.
    assert.ok(Math.abs(ete[0] - (4.075 + 2.5) * 1.2) < 1e-9);
    // Été, 400 EUR/MWh : plafonné à 14.17.
    assert.ok(Math.abs(ete[2] - (14.17 + 2.5) * 1.2) < 1e-9);
    // Été, 100 EUR/MWh : sous le plafond été ? 10 + 1.49 + 3.085 = 14.575 > 14.17 → plafonné.
    assert.ok(Math.abs(ete[1] - (14.17 + 2.5) * 1.2) < 1e-9);

    // Date sans données : null. Mémoïsation : même référence en relecture.
    assert.strictEqual(abo.spotPricesFor('2022/01/01'), null);
    assert.strictEqual(abo.spotPricesFor('2026/01/15'), hiver);
});

test('spot : validation (source, champs interdits, spotFormula)', () => {
    expectError(validSpotDef(), 'source de prix spot inconnue'); // sandbox sans defineSpotPrices
    expectError(validSpotDef({ dayRule: { type: 'spot' } }), 'clés attendues { type: "spot", source }');
    expectError(validSpotDef({ dayRule: { type: 'spot', source: 'spot-test', default: 'x' } }), 'clés attendues', spotSandbox());
    expectError(validSpotDef({ dayTypes: { bleu: { price: 10 } } }), 'dayTypes : à omettre', spotSandbox());
    expectError(validSpotDef({ hcRanges: [{ from: '22:00', to: '24:00' }] }), 'hcRanges : à omettre', spotSandbox());
    expectError(validSpotDef({ priceOverrides: { 6: { bleu: { price: 1 } } } }), 'priceOverrides : à omettre', spotSandbox());
    expectError(validSpotDef({ spotFormula: undefined }), 'spotFormula manquant', spotSandbox());

    const formula = overrides => validSpotDef({ spotFormula: { ...validSpotDef().spotFormula, ...overrides } });
    expectError(formula({ inconnu: 1 }), 'spotFormula.inconnu : clé inconnue', spotSandbox());
    expectError(formula({ turpe: { hiver: 6.32 } }), 'spotFormula.turpe : objet { hiver, ete }', spotSandbox());
    expectError(formula({ cap: 25 }), 'spotFormula.cap : objet { hiver, ete }', spotSandbox());
    expectError(formula({ accise: '3' }), 'spotFormula.accise', spotSandbox());
    expectError(formula({ marge: -1 }), 'spotFormula.marge', spotSandbox());
    expectError(formula({ tva: 0.2 }), 'spotFormula.tva : multiplicateur', spotSandbox());
});

test('validation : defineSpotPrices (dates, longueurs, redéfinition, cumul)', () => {
    const sandbox = freshSandbox();
    assert.throws(() => sandbox.defineSpotPrices('bad', { '15/01/2026': Array(24).fill(1) }), /date invalide/);
    assert.throws(() => sandbox.defineSpotPrices('bad', { '2026/01/15': Array(23).fill(1) }), /24 ou 96 valeurs/);
    assert.throws(() => sandbox.defineSpotPrices('bad', { '2026/01/15': [...Array(23).fill(1), 'x'] }), /valeurs non numériques/);
    assert.throws(() => sandbox.defineSpotPrices('bad', {}), /au moins un jour/);

    // Cumul entre fichiers (un par année) sur la même source.
    sandbox.defineSpotPrices('ok', { '2025/12/31': Array(96).fill(1) });
    sandbox.defineSpotPrices('ok', { '2026/01/01': Array(96).fill(2) });
    assert.strictEqual(sandbox.SpotPrices.ok.days['2025/12/31'][0], 1);
    assert.strictEqual(sandbox.SpotPrices.ok.days['2026/01/01'][0], 2);
    // Redéfinition d'un jour existant : erreur.
    assert.throws(() => sandbox.defineSpotPrices('ok', { '2026/01/01': Array(96).fill(3) }), /déjà défini/);
});

test('validation : plages horaires', () => {
    expectError(validDef({ hcRanges: undefined }), 'hcRanges manquant');
    expectError(validDef({ dayTypes: { bleu: { price: 10 } }, hcRanges: [{ from: '22:00', to: '24:00' }] }), 'à omettre');
    expectError(validDef({ hcRanges: [{ from: '22:00', to: '22:00' }] }), 'plage vide');
    expectError(validDef({ hcRanges: [{ from: '22:15', to: '24:00' }] }), 'plage invalide');
    expectError(validDef({ hcRanges: [{ from: '22:00', to: '24:30' }] }), 'plage invalide');
});

test('validation : defineCalendar (dates, redéfinition)', () => {
    const sandbox = freshSandbox();
    assert.throws(() => sandbox.defineCalendar('bad', { rouge: { days: ['07/01/2026'] } }), /date invalide/);
    sandbox.defineCalendar('ok', { rouge: { days: ['2026/01/07'] } });
    assert.throws(() => sandbox.defineCalendar('ok', { rouge: { days: ['2026/01/08'] } }), /déjà défini/);
});

test('un tarif en erreur n\'est pas poussé dans le registre', () => {
    const sandbox = freshSandbox();
    assert.throws(() => sandbox.defineTarif(validDef({ name: '' })));
    assert.strictEqual(sandbox.abonnements.length, 0);
});
