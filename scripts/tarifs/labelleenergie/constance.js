defineTarif({
    name: "La Belle Energie - Constance",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        3: 15.63,
        6: 19.37,
        9: 23.39,
        12: 27.27,
        15: 30.9,
        18: 34.65,
        24: 42.64,
        30: 49.97,
        36: 57.38
    },
    dayTypes: { bleu: { price: 19.85 } },
    priceOverrides: {
        3: { bleu: { price: 20.01 } },
        6: { bleu: { price: 20.01 } }
    },
    dayRule: { type: "constant", dayType: "bleu" }
});
