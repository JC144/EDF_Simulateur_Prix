defineTarif({
    name: "EDF - Zen Week-End",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    subscriptions: { 3: 12.13, 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        bleu: { price: 22.85 },
        weekend: { price: 17.1 }
    },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] } }
});

defineTarif({
    name: "EDF - Zen Week-End HC",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        bleu: { HP: 23.59, HC: 17.62 },
        weekend: { HP: 17.62, HC: 17.62 }   // tout le week-end au prix HC
    },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] } },
    hcRanges: "custom"
});

// Les jours de sobriété viennent du calendrier partagé
// scripts/tarifs-lib/calendars/zenflex-sobriete.js (chargé avant ce fichier).
// Pas de report « avant 6h = veille » sur cette offre.
defineTarif({
    name: "EDF - Zen Week-End Option Flex",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-flex.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        bleu: { HP: 21.42, HC: 15.95 },
        sobriete: { HP: 74.67, HC: 21.42 }
    },
    dayRule: { type: "calendar", default: "bleu", calendar: "zenflex-sobriete" },
    hcRanges: [
        { from: "00:00", to: "08:00" },
        { from: "13:00", to: "18:00" },
        { from: "20:00", to: "24:00" }
    ]
});
