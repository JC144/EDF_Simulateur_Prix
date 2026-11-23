import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse as sobry } from '../parsers/sobry.mjs';
import { KVAS } from '../lib/table.mjs';
import { row } from './helpers/pdf-row.mjs';

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
