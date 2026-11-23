defineTarif({
    name: "Volterres - Mon producteur (riverains) - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    eligibility: "Tarif commun avant éventuelle remise locale. La commune doit être éligible à un projet Volterres.",
    subscription_url: "https://volterres.fr/particuliers-riverains/",
    price_url: "https://volterres.fr/grille-tarifaire",
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
    dayTypes: {
        bleu: {
            price: 19.85
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 20.01
            }
        },
        6: {
            bleu: {
                price: 20.01
            }
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Volterres - Mon producteur (riverains) - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    eligibility: "Tarif commun avant éventuelle remise locale. La commune doit être éligible à un projet Volterres.",
    subscription_url: "https://volterres.fr/particuliers-riverains/",
    price_url: "https://volterres.fr/grille-tarifaire",
    subscriptions: {
        6: 15.86,
        9: 19.88,
        12: 23.76,
        15: 27.4,
        18: 31.14,
        24: 39.14,
        30: 46.47,
        36: 53.88
    },
    dayTypes: {
        bleu: {
            HP: 21.42,
            HC: 15.89
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
