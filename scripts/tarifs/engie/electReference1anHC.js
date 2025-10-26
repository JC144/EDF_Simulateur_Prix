abonnements.push(
    {
        name: "Engie - Elec Référence 1 an HC",
        lastUpdate: "2025-10-24",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference.pdf",
        prices: [
            { puissance: 6, abonnement: 37.43 / 12 },
            { puissance: 9, abonnement: 38.95 / 12 },
            { puissance: 12, abonnement: 38.90 / 12 },
            { puissance: 15, abonnement: 36.40 / 12 },
            { puissance: 18, abonnement: 35.18 / 12 },
            { puissance: 24, abonnement: 38.10 / 12 },
            { puissance: 30, abonnement: 33.96 / 12 },
            { puissance: 36, abonnement: 30.40 / 12 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 13.704,  prixKwhHP: 16.240 }
        })),
        hc: [{
            start: {hour:22, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:6, minute:0}
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

