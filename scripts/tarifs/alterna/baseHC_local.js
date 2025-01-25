abonnements.push({
    name: "Alterna - Heures Creuses Locale",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-locale",
    prices: [
        { puissance: 6, abonnement: 14.32 },
        { puissance: 9, abonnement: 18.12 },
        { puissance: 12, abonnement: 21.83 },
        { puissance: 15, abonnement: 25.37 },
        { puissance: 18, abonnement: 28.87 },
        { puissance: 24, abonnement: 36.23 },
        { puissance: 30, abonnement: 42.92 },
        { puissance: 36, abonnement: 49.66 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 24.06, prixKwhHC: 18.49 }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
