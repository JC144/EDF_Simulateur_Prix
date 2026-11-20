import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as alpiq } from '../parsers/alpiq.mjs';
import { parse as engie } from '../parsers/engie.mjs';
import { parse as labelleenergie } from '../parsers/labelleenergie.mjs';
import { parse as sobry } from '../parsers/sobry.mjs';
import { KVAS } from '../lib/table.mjs';

// Fragments de texte positionnés comme dans les tableaux PDF.
function row(y, x, cells, gap = 30) {
    return cells.map((str, i) => ({ str, x: x + i * gap, y, w: 10 }));
}

test('Alpiq : tranche Base 3–6 kVA et TTC 36 kVA HC imprimé dans le tableau Base', () => {
    const items = [];
    const y = kva => 800 - kva * 12;
    for (let kva = 3; kva <= 36; kva++) {
        const monthly = kva === 36 ? '53,88' : '52,64';
        items.push(...row(y(kva), 10, [`${kva} kVA`, '39,71', monthly]));
        if (kva >= 6) {
            items.push(...row(y(kva), 260, [`${kva} kVA`, '39,71']));
            items.push(...row(y(kva), kva === 36 ? 40 : 320, [monthly]));
        }
    }
    for (const [kva, price] of [[4.5, '0,199248'], [21.5, '0,197695']]) {
        items.push(...row(y(kva), 100, ['0,136100', '0,200064', '0,135420', price]));
    }
    items.push(...row(y(21), 350, Array(8).fill('0,150000')));
    const doc = { pages: [{ items }] };
    const { offers } = alpiq(doc);
    const base = offers['Alpiq - Base'];
    assert.equal(base.priceOverrides[6].bleu.HP, 19.9248);
    assert.equal(base.priceOverrides[7], undefined);
    assert.equal(base.dayTypes.bleu.HP, 19.7695);
    assert.equal(offers['Alpiq - Heures Creuses'].subscriptions[36], 53.88);
    items.find(it => it.y === y(36) && it.x === 40 && it.str === '53,88').str = '54,99';
    assert.throws(() => alpiq(doc), /36 kVA ambigu/);
});

test('La Bellenergie : la ligne détachée des 18 kVA contient aussi les deux prix du kWh', () => {
    const items = [];
    for (const [i, name] of ['Prudence', 'Constance', 'Garance'].entries()) {
        const y = 800 - 150 * i;
        items.push(...row(y, 12, [name]), ...row(y - 30, 12, ['3', '12,14', '15,63']));
        items.push(...row(y - 50, 12, ['18']), ...row(y - 54, 42, ['26,03', '34,65', '0,1348', '0,1985']));
        items.push(...row(y - 30, 280, ['6', '14,86', '19,37', '0,1479', '0,2142', '0,1018', '0,1589']));
    }
    const doc = { pages: [{ items: [] }, { items }] };
    const { offers } = labelleenergie(doc);
    assert.equal(offers['La Belle Energie - Constance'].subscriptions[18], 34.65);
    assert.equal(offers['La Belle Energie - Constance'].dayTypes.bleu.price, 19.85);
    assert.equal(offers['La Belle Energie - Constance HC'].subscriptions[6], 19.37);
});

test('Engie : CU et MUDT, obligations à la souscription et ligne HP/HC indisponible', () => {
    function table(x, getValues) {
        const pairs = getValues('6').length / 2;
        const items = row(760, x + 30, Array(pairs).fill(['HTT', 'TTC*']).flat());
        KVAS.forEach((kva, i) => items.push(...row(730 - i * 16, x, [kva, ...getValues(kva)])));
        return items;
    }
    function section(title, items, end) {
        return { items: [...row(800, 10, [title]), ...items, ...row(550, 10, [end])] };
    }
    const supply = section('Fourniture comptage simple (CS)   Fourniture comptage (HP/HC)', [
        ...table(10, () => ['38,16', '45,79', '0,08925', '0,14384']),
        ...table(300, k => k === '3' ? Array(6).fill('-') : ['38,16', '45,79', '0,09052', '0,14537', '0,07253', '0,12378']),
    ], 'Acheminement (CU)');
    supply.items.push(...row(830, 10, ['Grille tarifaire - août 2026']));
    const cu = section('Acheminement (CU)', table(10, () => ['108,25', '149,39', '0,04990', '0,05988']), '(CU4)');
    const mudt = section('Acheminement (MUDT)', table(10, () => ['123,19', '170,00', '0,05090', '0,06108', '0,03610', '0,04332']), '(MU4)');
    const obligations = section('Obligation comptage simple (CS)   Obligation Heures pleines/creuses', [
        ...row(780, 40, ['Prix par kWh à la souscription', 'Prix par kWh maximal']),
        ...row(780, 330, ['Prix par kWh à la souscription', 'Prix par kWh maximal']),
        ...table(10, k => ['0,01503', Number(k) <= 6 ? '0,01804' : '0,01976', '0,02941', '0,03529']),
        ...table(300, k => k === '3' ? Array(4).fill('-') : ['0,01663', '0,01996', '0,03506', '0,04207']),
    ], '*Prix hors évolution');
    const doc = { pages: [supply, cu, mudt, obligations] };
    const { gridDate, offers } = engie(doc);
    assert.equal(gridDate, '2026-08-01');
    const base = offers['Engie - Elec Référence 3 ans'];
    assert.equal(base.subscriptions[6], 16.265);
    assert.equal(base.priceOverrides[6].bleu.price, 22.176);
    assert.equal(base.dayTypes.bleu.price, 22.348);
    const hc = offers['Engie - Elec Référence 3 ans HC'];
    assert.equal(hc.subscriptions[3], undefined);
    assert.equal(hc.subscriptions[6], 17.9825);
    assert.deepEqual(hc.dayTypes.bleu, { HP: 22.641, HC: 18.706 });
    obligations.items.splice(obligations.items.findIndex(it => it.str === '0,01996'), 1);
    assert.throws(() => engie(doc), /montants incomplets/);
});

test('Sobry : abonnement CU4 avec CTA, moyennes saisonnières et plafond annuel SoFlex', () => {
    function page(lines) {
        return { items: lines.flatMap((line, i) => row(800 - i * 15, 10, line.split('\t'))) };
    }
    const pages = [
        page(['Particuliers', 'La part fixe', 'Contribution tarifaire qui correspond à 15% du TURPE fixe HTVA',
            'Tarifs en vigueur au 1er novembre 2026']),
        page(['Particuliers', 'Période TTC', 'Hiver · Heures pleines 0,09264 €/kWh', "Accise sur l’électricité (ex-TICFE) 0,036744 €/kWh TTC"]),
        page(['Particuliers', 'Total plafonné', "SoFlex Plafond toute l’année 0,84 €/kWh TTC",
            "CEE (certificats d’économies d’énergie) 0,018 €/kWh TTC", 'Mécanisme de capacité 0,006 €/kWh TTC',
            'Marge Sobry (gestion du contrat) 0,0096 €/kWh TTC', 'Prime de couverture (coût du plafond garanti) S o F le x : 0,0024 €/kWh TTC']),
        page(['Particuliers', 'Abonnement mensuel C5', 'Tarif CU4 - €/mois Tarif MU4 - €/mois', 'kVA Abonnement TTC Abonnement TTC',
            ...KVAS.map(k => `${k}\t19,84\t21,07`)]),
        page(['Professionnels 3 → 36 kVA', 'Période HTVA', 'Hiver · Heures pleines 0,0772 €/kWh']),
        page(['Comment calculer mon kWh ?', 'Valeurs exprimées en €/kWh TTC',
            'TURPE variable moyen HP/HC TURPE Hiver : 0,0774 €/kWh · Été : 0,01836 €/kWh']),
    ];
    const { offers } = sobry({ pages });
    assert.deepEqual(Object.keys(offers), ['Sobry - SoFlex']);
    assert.equal(offers['Sobry - SoFlex'].subscriptions[6], 21.37465);
    assert.deepEqual(offers['Sobry - SoFlex'].spotFormula, {
        turpe: { hiver: 6.45, ete: 1.53 }, accise: 3.062, cap: { hiver: 70, ete: 70 },
        conformite: 2, marge: 0.8, prime: 0.2, tva: 1.2,
    });
    pages[3].items.pop();
    assert.throws(() => sobry({ pages }), /abonnement TTC ambigu/);
});
