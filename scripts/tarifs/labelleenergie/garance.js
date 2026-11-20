defineTarif({
    name: "La Belle Energie - Garance",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        3: 17.13,
        6: 20.87,
        9: 24.89,
        12: 28.77,
        15: 32.4,
        18: 36.15,
        24: 44.14,
        30: 51.47,
        36: 58.88
    },
    dayTypes: { bleu: { price: 19.85 } },
    priceOverrides: {
        3: { bleu: { price: 20.01 } },
        6: { bleu: { price: 20.01 } }
    },
    dayRule: { type: "constant", dayType: "bleu" }
});
