defineTarif({
    name: "EDF - Vert Electrique Week-End",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        bleu: { price: 21.71 },
        weekend: { price: 16.3 }
    },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] } }
});

defineTarif({
    name: "EDF - Vert Electrique Week-End Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.88, 30: 47.4, 36: 53.88 },
    dayTypes: {
        bleu: { HP: 22.59, HC: 16.91 },
        weekend: { HP: 16.91, HC: 16.91 }   // tout le week-end au prix HC
    },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] } },
    hcRanges: "custom"
});
