// Les offres Zen Week-End Plus ajoutent un jour avantageux choisi par
// l'utilisateur (réglage « jour Zen+ » du simulateur, via userDaySetting).
defineTarif({
    name: "EDF - Zen Week-End Plus",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        bleu: { price: 22.59 },
        weekend: { price: 16.91 }
    },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] }, userDaySetting: "jourZenPlus" }
});

defineTarif({
    name: "EDF - Zen Week-End Plus HC",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        bleu: { HP: 23.14, HC: 17.31 },
        weekend: { HP: 17.31, HC: 17.31 }   // tout le week-end au prix HC
    },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] }, userDaySetting: "jourZenPlus" },
    hcRanges: "custom"
});
