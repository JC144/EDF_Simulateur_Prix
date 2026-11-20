defineTarif({
    name: "Alterna - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-09-01",
    isCommunity: true,
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    subscriptions: {
        3: 13.93,
        6: 17.66,
        9: 22.56,
        12: 26.53,
        15: 30.26,
        18: 34.1,
        24: 42.28,
        30: 49.8,
        36: 57.39
    },
    dayTypes: { bleu: { HP: 20.54, HC: 15.28 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: "custom"
});
