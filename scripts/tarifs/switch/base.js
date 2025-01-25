abonnements.push({
    name: "Switch - Base",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.chezswitch.fr/offre-energie/#/",
    price_url: "https://api.chezswitch.fr/docs/2024.02.01_Grille_tarifaire_des_offres_delectricite.pdf?v=30",
    prices: [
        { puissance: 3, abonnement: 9.38 },
        { puissance: 6, abonnement: 12.27 },
        { puissance: 9, abonnement: 15.38 },
        { puissance: 12, abonnement: 18.55 },
        { puissance: 15, abonnement: 21.51 },
        { puissance: 18, abonnement: 24.45 },
        { puissance: 24, abonnement: 30.95 },
        { puissance: 30, abonnement: 36.50 },
        { puissance: 36, abonnement: 43.03 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 19.95 }
    })),
    hc: [{ start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
