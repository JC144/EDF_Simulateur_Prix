abonnements.push({
    name: "Alterna - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-10-24",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    prices: [
        { puissance: 6, abonnement: 11.30 },
        { puissance: 9, abonnement: 14.14 },
        { puissance: 12, abonnement: 16.87 },
        { puissance: 15, abonnement: 19.43 },
        { puissance: 18, abonnement: 22.08 },
        { puissance: 24, abonnement: 27.75 },
        { puissance: 30, abonnement: 32.93 },
        { puissance: 36, abonnement: 38.15 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 9.78,  prixKwhHP: 13.19 }
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
