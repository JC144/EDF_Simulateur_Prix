defineTarif({
    name: "Alterna - Base France",
    offer_type: "Marché",
    lastUpdate: "2026-09-01",
    isCommunity: true,
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    subscriptions: {
        3: 13.93,
        6: 17.66,
        9: 22.28,
        12: 26.16,
        15: 29.8,
        18: 33.54,
        24: 41.54,
        30: 48.87,
        36: 56.28
    },
    dayTypes: { bleu: { price: 19.04 } },
    priceOverrides: {
        3: { bleu: { price: 19.19 } },
        6: { bleu: { price: 19.19 } }
    },
    dayRule: { type: "constant", dayType: "bleu" }
});
