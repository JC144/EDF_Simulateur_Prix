abonnements.push({
    name: "Ilek - Heures Creuses",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.ilek.fr/grilles-tarifaires",
    price_url: "https://ilek.s3.amazonaws.com/uploads/producer/price_list_file/229/grille_electricite.pdf",
    prices: [
        { puissance: 6, abonnement: 23.70 },
        { puissance: 9, abonnement: 32.93 },
        { puissance: 12, abonnement: 38.47 },
        { puissance: 15, abonnement: 43.97 },
        { puissance: 18, abonnement: 48.62 },
        { puissance: 24, abonnement: 58.45 },
        { puissance: 30, abonnement: 62.28 },
        { puissance: 36, abonnement: 74.14 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 27.00, prixKwhHC: 20.68 }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
