// Tests golden-master : figent le comportement actuel des tarifs sur le CSV réel.
// Ces snapshots ne doivent PAS changer pendant le refactoring des tarifs.
// Régénération volontaire : UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"
import { test } from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../scripts/core/simulation.js';
import { installFreshRegistry, loadAbonnements } from './helpers/legacyLoader.mjs';
import { loadSampleData } from './helpers/csv.mjs';
import { defaultSettings, communitySettings } from './helpers/settings.mjs';
import { checkGolden, roundEuro, roundWh } from './helpers/golden.mjs';

const KVAS = [3, 6, 9, 12, 15, 18, 24, 30, 36];

const isEDF = abo => abo.name.includes('EDF');
const sumDays = (month, key) => month.days.reduce((total, day) => total + day[key], 0);

function monthlySnapshot(tarifs) {
    const snapshot = {};
    for (const tarif of tarifs) {
        snapshot[tarif.title] = tarif.allMonths.map(month => ({
            year: month.year,
            month: month.month,
            conso: roundWh(month.conso),
            price: roundEuro(month.price),
            hasErrors: month.hasErrors,
            nbDays: month.days.length,
            consoHC: roundWh(sumDays(month, 'consoHC')),
            priceHC: roundEuro(sumDays(month, 'priceHC')),
            consoHP: roundWh(sumDays(month, 'consoHP')),
            priceHP: roundEuro(sumDays(month, 'priceHP'))
        }));
    }
    return snapshot;
}

function dailySnapshot(tarifs) {
    const snapshot = {};
    for (const tarif of tarifs) {
        const months = tarif.allMonths.filter(m =>
            (m.year === 2024 && m.month === '12') || (m.year === 2025 && m.month === '01'));
        assert.strictEqual(months.length, 2, `${tarif.title} : fenêtre déc. 2024 / janv. 2025 incomplète`);
        snapshot[tarif.title] = months.flatMap(m => m.days.map(day => ({
            date: day.date,
            conso: roundWh(day.conso),
            price: roundEuro(day.price),
            consoHC: roundWh(day.consoHC),
            priceHC: roundEuro(day.priceHC),
            consoHP: roundWh(day.consoHP),
            priceHP: roundEuro(day.priceHP)
        })));
    }
    return snapshot;
}

function daytypesSnapshot(abonnements, hours) {
    const dates = loadSampleData().map(day => day.date);
    const snapshot = {};
    for (const abo of abonnements) {
        const perDate = {};
        for (const date of dates) {
            const day = { date };
            perDate[date] = hours.map(hour => abo.getDayType(day, { hour, minute: 0 })).join('/');
        }
        snapshot[abo.name] = perDate;
    }
    return snapshot;
}

function contractSnapshot(abo) {
    const contract = {
        name: abo.name,
        offer_type: abo.offer_type,
        lastUpdate: abo.lastUpdate,
        isCommunity: abo.isCommunity,
        subscription_url: abo.subscription_url,
        price_url: abo.price_url,
        // Puissance normalisée en number : certains legacy la portent en string
        // (Object.keys), le calculateur compare en == — équivalent pour le calcul.
        prices: abo.prices.map(p => ({ ...p, puissance: Number(p.puissance) })),
        // Avec hasHCCustom, la simulation écrase toujours hc avant tout calcul :
        // un hc pré-rempli est une donnée morte (cas Zen Week-End HC legacy),
        // normalisée en [] pour ne pas figer de l'inatteignable.
        hc: abo.hasHCCustom ? [] : abo.hc,
        // Flags normalisés en booléens : clé absente et false sont équivalents
        // pour le calculateur (ex. EJP legacy n'a pas la clé hasHCCustom).
        hasHCCustom: !!abo.hasHCCustom,
        hasSpecialDaysCustom: !!abo.hasSpecialDaysCustom,
        // Clé absente et [] sont équivalents pour les règles constantes.
        specialDays: abo.specialDays ?? []
    };
    if (Object.prototype.hasOwnProperty.call(abo, 'hcByDayType')) {
        contract.hcByDayType = abo.hcByDayType;
    }
    return contract;
}

test('chargement : tous les scripts de tarifs du manifeste se chargent sans erreur', () => {
    const abonnements = loadAbonnements();
    assert.ok(abonnements.length > 0);
    for (const abo of abonnements) {
        assert.strictEqual(typeof abo.name, 'string');
        assert.ok(Array.isArray(abo.prices) && abo.prices.length > 0, `${abo.name} : prices vide`);
        assert.strictEqual(typeof abo.getDayType, 'function', `${abo.name} : getDayType manquant`);
        assert.ok(Array.isArray(abo.hc), `${abo.name} : hc manquant`);
    }
});

for (const kva of KVAS) {
    test(`golden mensuel ${kva} kVA (réglages par défaut, tarifs EDF)`, () => {
        installFreshRegistry();
        const { calculatedMonths } = runSimulation(defaultSettings(kva), loadSampleData());
        checkGolden(`monthly-${kva}`, monthlySnapshot(calculatedMonths));
    });

    test(`golden mensuel community ${kva} kVA (tarifs non-EDF)`, () => {
        installFreshRegistry();
        const { calculatedMonths } = runSimulation(communitySettings(kva), loadSampleData());
        // Les tarifs EDF sont déjà figés par monthly-<kva> : on ne fige ici que les autres.
        checkGolden(`monthly-community-${kva}`, monthlySnapshot(calculatedMonths.filter(t => !t.title.includes('EDF'))));
    });
}

test('golden journalier 9 kVA (décembre 2024 et janvier 2025)', () => {
    installFreshRegistry();
    const { calculatedMonths } = runSimulation(defaultSettings(9), loadSampleData());
    checkGolden('daily-9kva', dailySnapshot(calculatedMonths));
});

test('golden journalier community 9 kVA (décembre 2024 et janvier 2025, tarifs non-EDF)', () => {
    installFreshRegistry();
    const { calculatedMonths } = runSimulation(communitySettings(9), loadSampleData());
    checkGolden('daily-community-9kva', dailySnapshot(calculatedMonths.filter(t => !t.title.includes('EDF'))));
});

test('golden dayTypes EDF : type de jour à 3h, 12h et 23h pour chaque date du CSV', () => {
    // Sans customisation : règles de jour telles que définies dans les fichiers.
    checkGolden('daytypes-edf', daytypesSnapshot(loadAbonnements().filter(isEDF), [3, 12, 23]));
});

test('golden dayTypes community : type de jour à 3h/12h/13h/14h/15h/16h/23h pour chaque date du CSV', () => {
    // Sondes supplémentaires 13-16h : distinguent les trois fenêtres Happy
    // d'Engie (13-15/14-16/15-17) ; 3h couvre le report de veille Enercoop
    // et les heures super creuses 2-6h de Charge'Heures.
    checkGolden('daytypes-community', daytypesSnapshot(loadAbonnements().filter(abo => !isEDF(abo)), [3, 12, 13, 14, 15, 16, 23]));
});

test('golden contrats EDF : champs statiques de chaque abonnement (grilles, plages, flags)', () => {
    checkGolden('contracts-edf', loadAbonnements().filter(isEDF).map(contractSnapshot));
});

test('golden contrats community : champs statiques de chaque abonnement non-EDF', () => {
    checkGolden('contracts-community', loadAbonnements().filter(abo => !isEDF(abo)).map(contractSnapshot));
});

test('golden display : table de présentation dérivée de chaque tarif', () => {
    const snapshot = {};
    for (const abo of loadAbonnements()) {
        snapshot[abo.name] = abo.display;
    }
    checkGolden('display-contracts', snapshot);
});
