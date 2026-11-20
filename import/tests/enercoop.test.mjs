import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, residentialAttachment } from '../parsers/enercoop.mjs';
import { resolveParser } from '../lib/registry.mjs';

test('l’import choisit uniquement la pièce jointe des particuliers et reconnaît son URL sans extension', async () => {
    const particulier = { id: 42, file_name: 'Annexes tarifaires clients particuliers.pdf', content_type: 'application/pdf' };
    const pro = { ...particulier, id: 81, file_name: 'Annexes tarifaires clients professionnels.pdf' };
    const url = residentialAttachment({ article_attachments: [pro, particulier] });
    assert.equal(url, 'https://www.faq.enercoop.fr/hc/fr/article_attachments/42');
    assert.equal((await resolveParser(url)).parser.parse, parse);
    assert.equal(await resolveParser('https://www.faq.enercoop.fr/hc/fr/articles/42'), null);
    for (const files of [[pro], [particulier, particulier]]) {
        assert.throws(() => residentialAttachment({ article_attachments: files }), /absente ou ambiguë/);
    }
});

// Même géométrie que l'annexe : abonnements par ligne, prix du kWh centrés
// sur 36 lignes (deux cellules, 1–6 et 7–36, en Base). Ordre des pages mélangé.
function grid(title, rates) {
    const items = [];
    const cell = (x, y, str) => items.push({ x, y, w: 12, str });
    cell(10, 820, 'Tarifs pour les particuliers, applicables à partir du 1er août 2026');
    cell(10, 800, title);
    if (rates.length >= 4) cell(10, 780, 'HIVER (novembre à mars) ETE (avril à octobre)');
    if (rates.length >= 2) cell(10, 760, Array(rates.length >= 4 ? 2 : 1).fill('Heures pleines Heures creuses').join(' '));
    cell(10, 740, Array(rates.length + 1).fill('HTT TTC').join(' '));
    for (let kva = 1; kva <= 36; kva++) {
        const y = 700 - (kva - 1) * 16;
        cell(10, y, String(kva));
        cell(55, y, kva + ',00 €');
        cell(100, y, kva + ',99 €');
    }
    function price(i, y, value) {
        cell(145 + i * 90, y, '0,10000 €');
        cell(190 + i * 90, y, value + ' €');
    }
    if (rates.length === 1) {
        price(0, 660, '0,25406');
        price(0, 372, rates[0]);
    } else {
        rates.forEach((v, i) => price(i, 420, v));
    }
    return { items };
}

test('annexes Enercoop : paliers Base, saisons, pointe et exclusion de la grille fermée', () => {
    const season = 'Offre Flexibilité - 2 saisons';
    const rates = ['0,29011', '0,21613', '0,19576', '0,13764'];
    const base = grid('Basic Watt - base', ['0,25714']);
    const pages = [grid(season + ' Option “Jours de pointe”', [...rates, '0,53744']),
        grid('2 saisons HP/HC — Offre fermée à la souscription', rates), base,
        grid('Flexi Watt - nuit & week-end', ['0,30638', '0,17290']),
        grid(season, rates), grid('Flexi Watt - heures creuses', ['0,27764', '0,18983'])];
    const { gridDate, offers } = parse({ pages });
    assert.equal(gridDate, '2026-08-01');
    assert.equal(Object.keys(offers).length, 5);
    const basic = offers['Enercoop - Base'];
    assert.deepEqual(Object.keys(basic.priceOverrides), ['1', '2', '3', '4', '5', '6']);
    assert.equal(basic.priceOverrides[6].bleu.price, 25.406);
    assert.equal(basic.dayTypes.bleu.price, 25.714);
    const peak = offers['Enercoop - Flexibilité 2 saisons - Jours de pointe'];
    assert.equal(peak.subscriptions[36], 36.99);
    assert.deepEqual(peak.dayTypes.etePointe, { HC: 13.764, HP: 53.744 });
    assert.deepEqual(peak.dayTypes.hiverPointe, { HC: 21.613, HP: 53.744 });
    base.items = base.items.filter(it => it.str !== '11,99 €');
    assert.throws(() => parse({ pages }), /abonnements.*incomplets/);
});
