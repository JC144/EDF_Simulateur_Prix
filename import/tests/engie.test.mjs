import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as engie } from '../parsers/engie.mjs';
import { KVAS } from '../lib/table.mjs';
import { row } from './helpers/pdf-row.mjs';

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
