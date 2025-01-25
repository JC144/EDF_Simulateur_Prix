abonnements.push({
    name: "Engie - Elec Tranquillité 1 an HC",
    lastUpdate: "2024-02-01",
    subscription_url: "https://particuliers.engie.fr/electricite.html",
    price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-tranquillite.pdf",
    prices: [
        { puissance: 6, abonnement: 13.39 },
        { puissance: 9, abonnement: 17.00 },
        { puissance: 12, abonnement: 20.52 },
        { puissance: 15, abonnement: 23.89 },
        { puissance: 18, abonnement: 27.22 },
        { puissance: 24, abonnement: 34.22 },
        { puissance: 30, abonnement: 40.60 },
        { puissance: 36, abonnement: 47.04 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 27.00, prixKwhHC: 20.676 }
    })),
    hc: [
        { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
        { start: { hour: 0, minute: 0 }, end: { hour: 6, minute: 0 } }
    ],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
