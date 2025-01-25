abonnements.push({
    name: "EDF - Zen Fixe",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-fixe.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
    prices: [
        { puissance: 3, abonnement: 10.49 },
        { puissance: 6, abonnement: 14.07 },
        { puissance: 9, abonnement: 18.47 },
        { puissance: 12, abonnement: 22.66 },
        { puissance: 15, abonnement: 26.22 },
        { puissance: 18, abonnement: 30.00 },
        { puissance: 24, abonnement: 38.71 },
        { puissance: 30, abonnement: 45.18 },
        { puissance: 36, abonnement: 53.06 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 19.06 }
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
