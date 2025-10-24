abonnements.push(
    {
        name: "Engie - Elec Tranquillité 1 an",
        lastUpdate: "2025-10-24",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-tranquillite.pdf",
        prices: [
            { puissance: 3, abonnement: 116.97 / 12 },
            { puissance: 6, abonnement: 153.59 / 12 },
            { puissance: 9, abonnement: 192.86 / 12 },
            { puissance: 12, abonnement: 232.90 / 12 },
            { puissance: 15, abonnement: 270.28 / 12 },
            { puissance: 18, abonnement: 307.40 / 12 },
            { puissance: 24, abonnement: 389.50 / 12 },
            { puissance: 30, abonnement: 459.69 / 12 },
            { puissance: 36, abonnement: 542.17 / 12 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 26.119,  prixKwhHP: 26.119 }
        })),
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

