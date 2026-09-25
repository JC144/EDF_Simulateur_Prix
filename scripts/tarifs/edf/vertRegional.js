defineTarif({
    name: "EDF - Vert Electrique Régional",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: { bleu: { price: 20.65 } },
    // 6 kVA a un prix du kWh plus bas que les autres puissances
    priceOverrides: { 6: { bleu: { price: 20.37 } } },
    dayRule: { type: "constant", dayType: "bleu" }
});

defineTarif({
    name: "EDF - Vert Electrique Régional Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    subscriptions: { 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: { bleu: { HP: 22.37, HC: 15.6 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: "custom"
});
