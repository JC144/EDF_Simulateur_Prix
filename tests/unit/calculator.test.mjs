import { test } from 'node:test';
import assert from 'node:assert';
import { computeMonths, sumPeriod } from '../../scripts/core/calculator.js';
import { makeFullDay, makePartialDay, makeGrille } from '../helpers/makeDay.mjs';

const HC_TEMPO = [
    { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
    { start: { hour: 0, minute: 0 }, end: { hour: 6, minute: 0 } }
];

// Vue résolue étroite attendue par computeMonths, telle que construite
// par simulation.js à partir d'une grille.
function viewOf(grille, kva = 6) {
    return {
        plan: grille.prices.find(p => p.puissance === kva),
        getDayType: grille.getDayType.bind(grille),
        hcRangesFor: dayType => grille.hcByDayType?.[dayType] ?? grille.hc
    };
}

function typeAt(monthsData, timeLabel) {
    const hour = monthsData[0].days[0].hours.find(h =>
        `${String(h.time.hour).padStart(2, '0')}:${String(h.time.minute).padStart(2, '0')}` === timeLabel);
    assert.ok(hour, `relevé ${timeLabel} introuvable`);
    return hour.type;
}

test('frontières isHC : début strict, fin incluse, minuit = 24h, demi-heures', () => {
    const grille = makeGrille({ hc: HC_TEMPO });
    const months = computeMonths(viewOf(grille), [makeFullDay('2024/03/05')]);

    assert.strictEqual(typeAt(months, '22:00'), 'bleu HP'); // time > begin est strict
    assert.strictEqual(typeAt(months, '22:30'), 'bleu HC');
    assert.strictEqual(typeAt(months, '24:00'), 'bleu HC'); // minuit compté comme 24h -> fin de plage incluse
    assert.strictEqual(typeAt(months, '00:30'), 'bleu HC');
    assert.strictEqual(typeAt(months, '06:00'), 'bleu HC'); // fin de plage incluse
    assert.strictEqual(typeAt(months, '06:30'), 'bleu HP');
    assert.strictEqual(typeAt(months, '12:00'), 'bleu HP');
});

test('formule de prix : W / step -> kWh, centimes -> euros, abonnement réparti par jour', () => {
    // 48 relevés de 1000 W à pas 30 min -> 24 kWh sur la journée
    const grille = makeGrille({ hc: [{ start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } }] });
    const months = computeMonths(viewOf(grille), [makeFullDay('2024/03/05', 1000)]);
    const day = months[0].days[0];

    assert.strictEqual(day.conso, 24000); // en Wh
    // 24 kWh à 10 c€/kWh = 2,40 € + abonnement 30 €/31 jours
    assert.ok(Math.abs(day.price - (2.4 + 30 / 31)) < 1e-9);
});

test('relevés fournis dans le désordre (export EDF : du plus récent au plus ancien) -> hours triées chronologiquement', () => {
    const grille = makeGrille();
    const day = makeFullDay('2024/03/05');
    day.hours = [...day.hours].reverse();
    const months = computeMonths(viewOf(grille), [day]);

    const labels = months[0].days[0].hours.map(h =>
        `${String(h.time.hour).padStart(2, '0')}:${String(h.time.minute).padStart(2, '0')}`);
    assert.deepStrictEqual(labels, [...labels].sort());
    assert.strictEqual(labels[0], '00:30');
    assert.strictEqual(labels[labels.length - 1], '24:00');
});

test('jour incomplet (moins de 24 relevés) : conso et prix NaN', () => {
    const grille = makeGrille();
    const months = computeMonths(viewOf(grille), [makePartialDay('2024/03/05', 10)]);
    const day = months[0].days[0];

    assert.ok(Number.isNaN(day.conso));
    assert.ok(Number.isNaN(day.price));
    assert.strictEqual(day.consoHC, 0); // les agrégats HC/HP restent à zéro
});

test('mois incomplet : hasErrors et abonnement facturé sur les jours manquants', () => {
    const grille = makeGrille();
    const months = computeMonths(viewOf(grille), [makeFullDay('2024/03/05', 1000)]);
    const month = months[0];

    assert.strictEqual(month.hasErrors, true);
    assert.strictEqual(month.numberOfDaysInMonth, 31);
    // prix du mois = prix du seul jour présent + 30 jours d'abonnement manquants
    const expected = month.days[0].price + 30 * month.aboPriceByDay;
    assert.ok(Math.abs(month.price - expected) < 1e-9);
});

test('puissance absente de la grille : aucun mois calculé', () => {
    const grille = makeGrille();
    const months = computeMonths(viewOf(grille, 42), [makeFullDay('2024/03/05')]);
    assert.deepStrictEqual(months, []);
});

test('hcByDayType prioritaire sur hc', () => {
    // hc dit "tout HC" mais hcByDayType.bleu dit "rien en HC" : hcByDayType gagne
    const grille = makeGrille({
        hc: [{ start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } }],
        hcByDayType: { bleu: [] }
    });
    const months = computeMonths(viewOf(grille), [makeFullDay('2024/03/05')]);
    const day = months[0].days[0];

    assert.strictEqual(day.consoHC, 0);
    assert.ok(day.consoHP > 0);
});

test('hcByDayType sans entrée pour le dayType : retombe sur hc', () => {
    const grille = makeGrille({
        hc: [{ start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } }],
        hcByDayType: { autre: [] }
    });
    const months = computeMonths(viewOf(grille), [makeFullDay('2024/03/05')]);
    assert.strictEqual(months[0].days[0].consoHP, 0);
});

// ------------------------------------------------------------------ //
//  Tarifs spot : prix par créneau via spotPricesFor                  //
// ------------------------------------------------------------------ //

// Vue spot : grille sans types de jour, prix par pas fournis par date.
function spotViewOf(pricesByDate, kva = 6) {
    const grille = makeGrille({
        prices: [{ puissance: 6, abonnement: 30 }],
        getDayType: function () { return 'spot'; }
    });
    return {
        ...viewOf(grille, kva),
        spotPricesFor: date => pricesByDate[date] ?? null
    };
}

// Journée à 96 pas de 15 min (relevés 00:15 ... 24:00).
function makeQuarterDay(date, watts = 1000) {
    const hours = [];
    for (let i = 0; i < 96; i++) {
        const minutes = (i + 1) * 15;
        const hour = Math.floor(minutes / 60);
        const minute = String(minutes % 60).padStart(2, '0');
        hours.push([`${String(hour).padStart(2, '0')}:${minute}:00`, String(watts)]);
    }
    return { date, hours };
}

function priceAt(monthsData, timeLabel) {
    const hour = monthsData[0].days[0].hours.find(h =>
        `${String(h.time.hour).padStart(2, '0')}:${String(h.time.minute).padStart(2, '0')}` === timeLabel);
    assert.ok(hour, `relevé ${timeLabel} introuvable`);
    return hour.price;
}

test('spot : conso 30 min × prix horaires (24) — un relevé = son heure, minuit = dernier créneau', () => {
    // Prix horaire = index de l'heure en centimes : lisible dans les attentes.
    const slotPrices = Array.from({ length: 24 }, (_, h) => h);
    const months = computeMonths(spotViewOf({ '2024/03/05': slotPrices }), [makeFullDay('2024/03/05', 1000)]);

    // 1000 W à pas 30 min = 0,5 kWh par relevé.
    assert.ok(Math.abs(priceAt(months, '00:30') - 0.5 * 0 / 100) < 1e-12); // heure 0
    assert.ok(Math.abs(priceAt(months, '01:00') - 0.5 * 0 / 100) < 1e-12); // ]00:30;01:00] -> heure 0
    assert.ok(Math.abs(priceAt(months, '01:30') - 0.5 * 1 / 100) < 1e-12); // heure 1
    assert.ok(Math.abs(priceAt(months, '12:00') - 0.5 * 11 / 100) < 1e-12); // ]11:30;12:00] -> heure 11
    assert.ok(Math.abs(priceAt(months, '24:00') - 0.5 * 23 / 100) < 1e-12); // minuit -> heure 23
    // Classement : tout en HC (plage pleine journée), type "spot HC".
    assert.strictEqual(typeAt(months, '12:00'), 'spot HC');
    assert.strictEqual(months[0].days[0].consoHP, 0);
});

test('spot : conso 30 min × prix quart-horaires (96) — moyenne des deux quarts couverts', () => {
    const slotPrices = Array.from({ length: 96 }, (_, i) => i);
    const months = computeMonths(spotViewOf({ '2024/03/05': slotPrices }), [makeFullDay('2024/03/05', 1000)]);

    // Relevé 00:30 couvre ]00:00;00:30] -> quarts 0 et 1, moyenne 0,5.
    assert.ok(Math.abs(priceAt(months, '00:30') - 0.5 * 0.5 / 100) < 1e-12);
    // Relevé 24:00 couvre ]23:30;24:00] -> quarts 94 et 95, moyenne 94,5.
    assert.ok(Math.abs(priceAt(months, '24:00') - 0.5 * 94.5 / 100) < 1e-12);
});

test('spot : conso 15 min × prix horaires (24) — chaque relevé lit son heure', () => {
    const slotPrices = Array.from({ length: 24 }, (_, h) => h);
    const months = computeMonths(spotViewOf({ '2024/03/05': slotPrices }), [makeQuarterDay('2024/03/05', 1000)]);

    // 1000 W à pas 15 min = 0,25 kWh par relevé.
    assert.ok(Math.abs(priceAt(months, '00:15') - 0.25 * 0 / 100) < 1e-12);
    assert.ok(Math.abs(priceAt(months, '11:45') - 0.25 * 11 / 100) < 1e-12); // ]11:30;11:45] -> heure 11
    assert.ok(Math.abs(priceAt(months, '12:00') - 0.25 * 11 / 100) < 1e-12); // ]11:45;12:00] -> heure 11
    assert.ok(Math.abs(priceAt(months, '12:15') - 0.25 * 12 / 100) < 1e-12);
    assert.ok(Math.abs(priceAt(months, '24:00') - 0.25 * 23 / 100) < 1e-12);
});

test('spot : jour sans données -> NaN pour ce tarif seulement', () => {
    const view = spotViewOf({}); // aucune date connue
    const months = computeMonths(view, [makeFullDay('2022/03/05', 1000)]);
    assert.ok(Number.isNaN(months[0].days[0].conso));
    assert.ok(Number.isNaN(months[0].days[0].price));

    // La même journée sur une vue classique (sans spotPricesFor) se calcule.
    const classic = computeMonths(viewOf(makeGrille()), [makeFullDay('2022/03/05', 1000)]);
    assert.ok(!Number.isNaN(classic[0].days[0].price));
});

test('sumPeriod : filtre par mois et exclut les NaN', () => {
    const monthsData = [
        { firstDayDate: new Date(2024, 0, 1), conso: 100, price: 10 },
        { firstDayDate: new Date(2024, 1, 1), conso: NaN, price: NaN },
        { firstDayDate: new Date(2024, 2, 1), conso: 200, price: 20 },
        { firstDayDate: new Date(2024, 3, 1), conso: 400, price: 40 } // hors période
    ];
    const period = sumPeriod(monthsData, new Date(2024, 0, 1), new Date(2024, 2, 1));

    assert.strictEqual(period.conso, 300);
    assert.strictEqual(period.price, 30);
    assert.strictEqual(period.months.length, 3);
});
