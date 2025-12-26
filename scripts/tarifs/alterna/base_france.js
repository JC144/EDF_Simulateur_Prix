abonnements.push(
    {
        name: "Alterna - Base France",
        offer_type: "Marché",
        lastUpdate: "2025-12-18",
        subscription_url: "https://www.alterna-energie.fr",
        price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
        prices: [
            { puissance: 3, abonnement: 11.73 },
            { puissance: 6, abonnement: 15.47 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 27.06 },
            { puissance: 18, abonnement: 30.76 },
            { puissance: 24, abonnement: 38.79 },
            { puissance: 30, abonnement: 46.44 },
            { puissance: 36, abonnement: 54.29 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 17.29,  prixKwhHP: 17.29 }
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

