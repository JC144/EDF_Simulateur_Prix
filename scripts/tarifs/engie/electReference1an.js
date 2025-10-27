abonnements.push(
    {
        name: "Engie - Elec Référence 1 an",
        lastUpdate: "2025-09-01",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference.pdf",
        prices: [
            { puissance: 3, abonnement: 36.61 / 12 },
            { puissance: 6, abonnement: 34.12 / 12 },
            { puissance: 9, abonnement: 33.91 / 12 },
            { puissance: 12, abonnement: 33.72 / 12 },
            { puissance: 15, abonnement: 31.21 / 12 },
            { puissance: 18, abonnement: 28.27 / 12 },
            { puissance: 24, abonnement: 29.89 / 12 },
            { puissance: 30, abonnement: 27.05 / 12 },
            { puissance: 36, abonnement: 26.51 / 12 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 15.998,  prixKwhHP: 15.998 }
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

