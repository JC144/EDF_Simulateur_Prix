abonnements.push(
    {
        "name": "UEM - Base",
        "offer_type": "TRV",
        "lastUpdate": "2025-01-04",
        "isCommunity": true,
        "subscription_url": "https://particuliers.uem-metz.fr/nos-offres-denergies/offre-delectricite/",
        "price_url": "https://particuliers.uem-metz.fr/wp-content/uploads/sites/2/2024/07/Tarif-bleu-particuliers.pdf",
        "prices": [
            {"puissance": 3, "abonnement": 116.23/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 6, "abonnement": 152.10/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 9, "abonnement": 190.63/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 12, "abonnement": 229.91/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 15, "abonnement": 266.54/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 18, "abonnement": 302.91/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 24, "abonnement": 383.51/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 30, "abonnement": 452.20/12, "bleu": {"prixKwhHC": 25.16}},
            {"puissance": 36, "abonnement": 533.19/12, "bleu": {"prixKwhHC": 25.16}}
        ],
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

