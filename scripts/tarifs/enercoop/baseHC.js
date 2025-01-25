abonnements.push({
    name: "Enercoop - Heures Creuses",
    lastUpdate: "2024-02-01",
    subscription_url: "https://souscription.enercoop.fr",
    price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
    prices: [
        { puissance: 3, abonnement: 11.49, prixKwhHC: 22.234 },
        { puissance: 6, abonnement: 19.19, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 9, abonnement: 25.82, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 12, abonnement: 31.74, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 15, abonnement: 37.67, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 18, abonnement: 43.59, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 24, abonnement: 55.44, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 30, abonnement: 67.29, prixKwhHP: 24.758, prixKwhHC: 16.780 },
        { puissance: 36, abonnement: 79.14, prixKwhHP: 24.758, prixKwhHC: 16.780 }
    ].map(item => ({
        puissance: item.puissance,
        abonnement: item.abonnement,
        bleu: item.prixKwhHP
            ? { prixKwhHP: item.prixKwhHP, prixKwhHC: item.prixKwhHC }
            : { prixKwhHC: item.prixKwhHC }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
