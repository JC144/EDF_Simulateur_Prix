abonnements.push(
    {
        name: "Engie - Elec Référence 1 an",
        lastUpdate: "2025-09-01",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference.pdf",
        prices: [
            { puissance: 3, abonnement: (36.61 + 105.36) / 12 },
            { puissance: 6, abonnement: (34.12 + 153.95) / 12 },
            { puissance: 9, abonnement: (33.91 + 202.55) / 12 },
            { puissance: 12, abonnement: (33.72 + 251.14) / 12 },
            { puissance: 15, abonnement: (31.21 + 299.73) / 12 },
            { puissance: 18, abonnement: (28.27 + 348.32) / 12 },
            { puissance: 24, abonnement: (29.89 + 445.50) / 12 },
            { puissance: 30, abonnement: (27.05 + 542.69) / 12 },
            { puissance: 36, abonnement: (26.51 + 639.87) / 12 }
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

abonnements.push(
    {
        name: "Engie - Elec Référence 1 an HC",
        lastUpdate: "2025-09-01",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference.pdf",
        prices: [
            { puissance: 6, abonnement: (37.43 + 175.20) / 12 },
            { puissance: 9, abonnement: (38.95 + 234.41) / 12 },
            { puissance: 12, abonnement: (38.90 + 293.63) / 12 },
            { puissance: 15, abonnement: (36.40 + 352.84) / 12 },
            { puissance: 18, abonnement: (35.18 + 412.06) / 12 },
            { puissance: 24, abonnement: (38.10 + 530.48) / 12 },
            { puissance: 30, abonnement: (33.96 + 648.91) / 12 },
            { puissance: 36, abonnement: (30.40 + 767.34) / 12 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 13.704, prixKwhHP: 16.240 }
        })),
        hc: [{
            start: { hour: 22, minute: 0 },
            end: { hour: 24, minute: 0 }
        },
        {
            start: { hour: 0, minute: 0 },
            end: { hour: 6, minute: 0 }
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
