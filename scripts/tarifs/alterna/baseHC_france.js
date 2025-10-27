abonnements.push({
    name: "Alterna - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-10-02",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    prices: [
        { puissance: 6, abonnement: 15.74 },
        { puissance: 9, abonnement: 20.21 },
        { puissance: 12, abonnement: 24.28 },
        { puissance: 15, abonnement: 28.15 },
        { puissance: 18, abonnement: 32.13 },
        { puissance: 24, abonnement: 40.53 },
        { puissance: 30, abonnement: 48.34 },
        { puissance: 36, abonnement: 56.20 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 19.43,  prixKwhHP: 15.33 }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});
