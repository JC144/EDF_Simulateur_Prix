abonnements.push({
    name: "EDF - Zen Online",
    offer_type: "Marché",
    lastUpdate: "2024-12-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
    prices: [
        { puissance: 3, abonnement: 9.69 },
        { puissance: 6, abonnement: 12.68 },
        { puissance: 9, abonnement: 16.18 },
        { puissance: 12, abonnement: 19.55 },
        { puissance: 15, abonnement: 22.70 },
        { puissance: 18, abonnement: 25.83 },
        { puissance: 24, abonnement: 32.74 },
        { puissance: 30, abonnement: 38.66 },
        { puissance: 36, abonnement: 44.43 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 23.03 }
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
