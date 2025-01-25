abonnements.push({
    name: "Enercoop - Base",
    lastUpdate: "2024-02-01",
    subscription_url: "https://souscription.enercoop.fr",
    price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
    prices: [
        { puissance: 3, abonnement: 10.10, prixKwhHC: 22.234 },
        { puissance: 6, abonnement: 16.02, prixKwhHC: 22.234 },
        { puissance: 9, abonnement: 22.28, prixKwhHC: 22.602 },
        { puissance: 12, abonnement: 27.68, prixKwhHC: 22.602 },
        { puissance: 15, abonnement: 33.65, prixKwhHC: 22.602 },
        { puissance: 18, abonnement: 39.62, prixKwhHC: 22.602 },
        { puissance: 24, abonnement: 51.57, prixKwhHC: 22.602 },
        { puissance: 30, abonnement: 63.51, prixKwhHC: 22.602 },
        { puissance: 36, abonnement: 75.46, prixKwhHC: 22.602 }
    ].map(item => ({
        puissance: item.puissance,
        abonnement: item.abonnement,
        bleu: { prixKwhHC: item.prixKwhHC }
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
