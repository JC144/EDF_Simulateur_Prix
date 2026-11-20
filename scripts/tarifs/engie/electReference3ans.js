// Prix reconstitués depuis la fiche descriptive (tous les montants en TTC) :
// abonnement = colonne "Abonnement" des tableaux fourniture + acheminement,
// prix du kWh = somme des colonnes "Prix par kWh" fourniture + acheminement
// + obligation, convertie en centimes (× 100).
defineTarif({
    name: "Engie - Elec Référence 3 ans",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/electricite.html",
    price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference-3-ans.pdf",
    // tableau "Fourniture comptage simple (CS)", colonne "Abonnement"
    // + tableau "Acheminement sans différenciation temporelle - courte utilisation (CU)"
    subscriptions: {
        3: 12.3283333333,
        6: 16.265,
        9: 20.2008333333,
        12: 24.1375,
        15: 28.0741666667,
        18: 32.01,
        24: 39.8833333333,
        30: 47.7558333333,
        36: 55.6291666667
    },
    dayTypes: { bleu: { price: 22.348 } },
    priceOverrides: {
        3: { bleu: { price: 22.176 } },
        6: { bleu: { price: 22.176 } }
    },
    dayRule: { type: "constant", dayType: "bleu" }
});

defineTarif({
    name: "Engie - Elec Référence 3 ans HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/electricite.html",
    price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference-3-ans.pdf",
    // tableau "Fourniture comptage Heures pleines/Heures creuses (HP/HC)", colonne "Abonnement"
    // + tableau "Acheminement à 2 plages temporelles - moyenne utilisation (MUDT)"
    subscriptions: {
        6: 17.9825,
        9: 22.7783333333,
        12: 27.5733333333,
        15: 32.3691666667,
        18: 37.165,
        24: 46.7558333333,
        30: 56.3466666667,
        36: 65.9375
    },
    // Fourniture HP/HC + acheminement MUDT + obligation à la souscription.
    dayTypes: {
        bleu: {
            HP: 22.641,
            HC: 18.706
        }
    },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]
});
