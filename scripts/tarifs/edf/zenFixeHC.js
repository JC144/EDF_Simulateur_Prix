abonnements.push({
    name: "EDF - Zen Fixe Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-fixe.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
    prices: [
        { puissance: 6, abonnement: 15.02 },
        { puissance: 9, abonnement: 19.97 },
        { puissance: 12, abonnement: 24.34 },
        { puissance: 15, abonnement: 27.64 },
        { puissance: 18, abonnement: 31.74 },
        { puissance: 24, abonnement: 40.48 },
        { puissance: 30, abonnement: 47.54 },
        { puissance: 36, abonnement: 54.99 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 20.28, prixKwhHC: 16.08 }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
