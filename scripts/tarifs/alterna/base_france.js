abonnements.push({
    name: "Alterna - Base France",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    prices: [
        { puissance: 3, abonnement: 9.69 },
        { puissance: 6, abonnement: 12.78 },
        { puissance: 9, abonnement: 16.06 },
        { puissance: 12, abonnement: 19.40 },
        { puissance: 15, abonnement: 22.53 },
        { puissance: 18, abonnement: 25.63 },
        { puissance: 24, abonnement: 32.48 },
        { puissance: 30, abonnement: 38.35 },
        { puissance: 36, abonnement: 45.23 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 25.39 }
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
