abonnements.push({
    name: "Alterna - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-05-07",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    prices: [
        { puissance: 6, abonnement: 15.05 },
        { puissance: 9, abonnement: 19.19 },
        { puissance: 12, abonnement: 23.01 },
        { puissance: 15, abonnement: 26.63 },
        { puissance: 18, abonnement: 30.35 },
        { puissance: 24, abonnement: 38.25 },
        { puissance: 30, abonnement: 45.55 },
        { puissance: 36, abonnement: 52.91 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 14.57,  prixKwhHP: 18.40 }
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
