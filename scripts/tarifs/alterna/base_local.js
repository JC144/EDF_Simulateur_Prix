abonnements.push(
    {
        name: "Alterna - Base Locale",
        offer_type: "Marché",
        lastUpdate: "2025-10-24",
        subscription_url: "https://www.alterna-energie.fr",
        price_url: "https://www.alterna-energie.fr/tarifs-electricite-locale",
        prices: [
            { puissance: 3, abonnement: 8.51 },
            { puissance: 6, abonnement: 11.07 },
            { puissance: 9, abonnement: 13.79 },
            { puissance: 12, abonnement: 16.51 },
            { puissance: 15, abonnement: 19.07 },
            { puissance: 18, abonnement: 21.60 },
            { puissance: 24, abonnement: 27.18 },
            { puissance: 30, abonnement: 32.45 },
            { puissance: 36, abonnement: 37.88 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 12.47,  prixKwhHP: 12.47 }
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

