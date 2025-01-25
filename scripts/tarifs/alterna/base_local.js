abonnements.push({
    name: "Alterna - Base Locale",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-locale",
    prices: [
        { puissance: 3, abonnement: 10.53 },
        { puissance: 6, abonnement: 13.87 },
        { puissance: 9, abonnement: 17.42 },
        { puissance: 12, abonnement: 21.03 },
        { puissance: 15, abonnement: 24.40 },
        { puissance: 18, abonnement: 27.75 },
        { puissance: 24, abonnement: 35.17 },
        { puissance: 30, abonnement: 41.50 },
        { puissance: 36, abonnement: 48.95 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 22.45 }
    })),
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
