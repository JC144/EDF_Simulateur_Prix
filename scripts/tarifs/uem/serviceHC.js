abonnements.push(
    {
        "name": "UEM - HP/HC",
        "offer_type": "TRV",
        "lastUpdate": "2025-01-04",
        "isCommunity": true,
        "subscription_url": "https://particuliers.uem-metz.fr/nos-offres-denergies/offre-delectricite/",
        "price_url": "https://particuliers.uem-metz.fr/wp-content/uploads/sites/2/2024/07/Tarif-bleu-particuliers.pdf",
        "prices": [
            { "puissance": 6, "abonnement": 159.37/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 9, "abonnement": 201.84/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 12, "abonnement": 243.30/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 15, "abonnement": 282.88/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 18, "abonnement": 322.06/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 24, "abonnement": 404.36/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 30, "abonnement": 479.31/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } },
            { "puissance": 36, "abonnement": 554.90/12, "bleu": { "prixKwhHC": 20.68, "prixKwhHP": 27.00 } }
        ],
        hc: [{
            start: {hour:23, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:7, minute:0}
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
