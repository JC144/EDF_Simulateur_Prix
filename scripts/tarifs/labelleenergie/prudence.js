defineTarif({
    name: "La Belle Energie - Prudence",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        3: 12.13,
        6: 15.86,
        9: 19.88,
        12: 23.76,
        15: 27.4,
        18: 31.14,
        24: 39.14,
        30: 46.47,
        36: 53.88
    },
    dayTypes: { bleu: { price: 19.85 } },
    priceOverrides: {
        3: { bleu: { price: 20.01 } },
        6: { bleu: { price: 20.01 } }
    },
    dayRule: { type: "constant", dayType: "bleu" }
});
