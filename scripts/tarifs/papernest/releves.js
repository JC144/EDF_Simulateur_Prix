defineTarif({
    name: "Papernest Énergie - Électricité 100 % renouvelable - Base",
    offer_type: "Marché",
    lastUpdate: "2026-09-22",
    isCommunity: true,
    subscription_url: "https://www.papernest.com/papernest-energie-electricite/",
    price_url: "https://assets.papernest.com/doc/ppn_energie_grille_tarifaire.pdf",
    subscriptions: {
        3: 16.39,
        6: 32.31,
        9: 48.57,
        12: 60.99,
        15: 71.77,
        18: 80.73,
        24: 105.75,
        30: 125.35,
        36: 150.28
    },
    dayTypes: {
        bleu: {
            price: 29.841
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Papernest Énergie - Électricité 100 % renouvelable - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-09-22",
    isCommunity: true,
    subscription_url: "https://www.papernest.com/papernest-energie-electricite/",
    price_url: "https://assets.papernest.com/doc/ppn_energie_grille_tarifaire.pdf",
    subscriptions: {
        6: 38.7,
        9: 56.23,
        12: 62.77,
        15: 71.77,
        18: 80.73,
        24: 105.75,
        30: 125.35,
        36: 150.28
    },
    dayTypes: {
        bleu: {
            HP: 32.023,
            HC: 24.528
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
