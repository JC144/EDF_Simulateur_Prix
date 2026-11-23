import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as labelleenergie } from '../parsers/labelleenergie.mjs';
import { row } from './helpers/pdf-row.mjs';

test('La Bellenergie : la ligne détachée des 18 kVA contient aussi les deux prix du kWh', () => {
    const items = [];
    for (const [i, name] of ['Prudence', 'Constance', 'Garance'].entries()) {
        const y = 800 - 150 * i;
        items.push(...row(y, 12, [name]), ...row(y - 30, 12, ['3', '12,14', '15,63']));
        items.push(...row(y - 50, 12, ['18']), ...row(y - 54, 42, ['26,03', '34,65', '0,1348', '0,1985']));
        items.push(...row(y - 30, 280, ['6', '14,86', '19,37', '0,1479', '0,2142', '0,1018', '0,1589']));
    }
    const customization = { items: [
        ...row(800, 10, ['Je choisis la région']), ...row(780, 10, ['1 € TTC / mois. Gratuit 6 mois']),
        ...row(750, 10, ['Je choisis la source']), ...row(730, 10, ['1 € TTC / mois. Gratuit 6 mois']),
    ] };
    const doc = { pages: [{ items: [] }, { items }, customization] };
    const { offers } = labelleenergie(doc);
    assert.equal(offers['La Belle Energie - Constance'].subscriptions[18], 34.65);
    assert.equal(offers['La Belle Energie - Constance'].dayTypes.bleu.price, 19.85);
    assert.equal(offers['La Belle Energie - Constance HC'].subscriptions[6], 19.37);
    assert.equal(offers['La Belle Energie - Constance - Région ou filière (après 6 mois) - HP/HC'].subscriptions[6], 20.37);
});
