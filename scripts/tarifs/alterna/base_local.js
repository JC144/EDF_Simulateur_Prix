abonnements.push(
    {
        name: "Alterna - Base Locale",
        offer_type: "Marché",
        lastUpdate: "2026-05-07",
        subscription_url: "https://www.alterna-energie.fr",
        price_url: "https://www.alterna-energie.fr/tarifs-electricite-locale",
        prices: [
            { puissance: 3, abonnement: 11.25 },
            { puissance: 6, abonnement: 14.78 },
            { puissance: 9, abonnement: 18.49 },
            { puissance: 12, abonnement: 22.21 },
            { puissance: 15, abonnement: 25.74 },
            { puissance: 18, abonnement: 29.23 },
            { puissance: 24, abonnement: 36.84 },
            { puissance: 30, abonnement: 44.07 },
            { puissance: 36, abonnement: 51.50 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 17.72,  prixKwhHP: 17.72 }
        })),
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

