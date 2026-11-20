import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveParser } from '../lib/registry.mjs';
import { KVAS } from '../lib/table.mjs';
import { parse } from '../parsers/alterna.mjs';

test('les trois liens permanents Alterna utilisent le parseur PDF', async () => {
    const site = 'https://www.alterna-energie.fr/';
    for (const slug of ['francaise', 'locale', 'vehicule-electrique']) {
        const resolved = await resolveParser(site + 'tarifs-electricite-' + slug);
        assert.equal(resolved?.provider, 'alterna');
        assert.equal(resolved.parser.parse, parse);
    }
    assert.equal(await resolveParser(site), null);
    assert.equal(await resolveParser(site + 'tarifs-electricite-gaz'), null);
});

// Une ligne par puissance, avec une seule colonne kVA commune aux options.
function page(lines) {
    const items = lines.flatMap((cells, i) => cells.map((str, j) => ({
        str, x: j * 80, y: 800 - i * 16, w: 20,
    })));
    return { items };
}

test('les grilles France et Locale séparent la Base à deux paliers et les Heures Creuses', () => {
    const ht = page([['Tarifs HT - applicables au 01/10/2021']]);
    for (const [title, baseName, hcName] of [
        ['Mon électricité française', 'Alterna - Base France', 'Alterna - Heures Creuses'],
        ['Mon électricité du coin', 'Alterna - Base Locale', 'Alterna - Heures Creuses Locale'],
    ]) {
        const ttc = page([
            [title], ['Tarifs TTC - applicables au 01/09/2026'],
            ['Option Base', 'Option Heures Creuses'],
            ['(en kVA)', '(en €/mois)', '(en €/kWh)', '(en €/mois)', 'H. Pleines', 'H. Creuses'],
            ...KVAS.map(kva => [kva, '22,28', Number(kva) <= 6 ? '0,1919' : '0,1904', '22,56', '0,2054', '0,1528']),
        ]);
        const { gridDate, offers } = parse({ pages: [ttc, ht] });
        assert.equal(gridDate, '2026-09-01');
        assert.equal(offers[baseName].subscriptions[9], 22.28);
        assert.equal(offers[baseName].dayTypes.bleu.price, 19.04);
        assert.deepEqual(offers[baseName].priceOverrides, { 3: { bleu: { price: 19.19 } }, 6: { bleu: { price: 19.19 } } });
        assert.equal(offers[hcName].subscriptions[9], 22.56);
        assert.deepEqual(offers[hcName].dayTypes.bleu, { HP: 20.54, HC: 15.28 });

        ttc.items.pop();
        assert.throws(() => parse({ pages: [ht, ttc] }), /montants TTC incomplets/);
        assert.throws(() => parse({ pages: [ht] }), /page TTC/);
    }
});

test('Heures Super Creuses associe chaque prix à sa saison et à sa période', () => {
    const periods = ['Heures pleines', 'Heures creuses', 'Heures super'];
    const ttc = page([
        ['Mon électricité Heures Super Creuses'], ['Tarifs TTC - applicables au 01/09/2026'],
        ['Hiver', 'Été'], ['Puissance souscrite', 'Abonnement', ...periods, ...periods],
        ['(en kVA)', '(en €/mois)', ...Array(6).fill('(en €/kWh)')],
        ...KVAS.map(kva => [kva, '17,66', '0,2228', '0,2066', '0,1791', '0,1985', '0,1823', '0,1500']),
    ]);
    const offer = parse({ pages: [ttc] }).offers['Alterna - Heures Super Creuses'];
    assert.equal(offer.subscriptions[6], 17.66);
    assert.deepEqual(offer.dayTypes, {
        hpHiver: { price: 22.28 }, hcHiver: { price: 20.66 }, hscHiver: { price: 17.91 },
        hpEte: { price: 19.85 }, hcEte: { price: 18.23 }, hscEte: { price: 15 },
    });
    ttc.items.find(it => it.str === 'Hiver').str = 'Été';
    assert.throws(() => parse({ pages: [ttc] }), /ordre des saisons/);
});
