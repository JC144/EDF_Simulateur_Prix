abonnements.push(
    {
        name: "Engie - Elec Tranquillité 1 an HC",
        lastUpdate: "2024-11-01",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-tranquillite.pdf",
        prices: [
            { puissance: 6, abonnement: 161.69 / 12 },
            { puissance: 9, abonnement: 205.33 / 12 },
            { puissance: 12, abonnement: 247.96 / 12 },
            { puissance: 15, abonnement: 288.70 / 12 },
            { puissance: 18, abonnement: 329.05 / 12 },
            { puissance: 24, abonnement: 413.68 / 12 },
            { puissance: 30, abonnement: 490.96 / 12 },
            { puissance: 36, abonnement: 568.88 / 12 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 21.442,  prixKwhHP: 28.033 }
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

