defineTarif({
    name: "Gedia - All Inclusive Électricité - Base",
    eligibility: "La proposition de prix est valable une journée. Vérifiez la date de votre proposition.",
    offer_type: "Marché",
    lastUpdate: "2026-11-23",
    isCommunity: true,
    subscription_url: "https://www.gedia-energies.com/offre/all-inclusive-electricite-fixe",
    price_url: "https://www.gedia-energies.com/api/documents/all-inclusive-electricite-fixe/grille-tarifaire",
    subscriptions: {
        3: 12.13,
        6: 15.86333333,
        9: 19.88416667,
        12: 23.76083333,
        15: 27.39833333,
        18: 31.1425,
        24: 39.13666667,
        30: 46.47083333,
        36: 53.87666667
    },
    dayTypes: {
        bleu: {
            price: 26.321
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 26.539
            }
        },
        6: {
            bleu: {
                price: 26.539
            }
        }
    }
});

defineTarif({
    name: "Gedia - All Inclusive Électricité - HP/HC",
    eligibility: "La proposition de prix est valable une journée. Vérifiez la date de votre proposition.",
    offer_type: "Marché",
    lastUpdate: "2026-11-23",
    isCommunity: true,
    subscription_url: "https://www.gedia-energies.com/offre/all-inclusive-electricite-fixe",
    price_url: "https://www.gedia-energies.com/api/documents/all-inclusive-electricite-fixe/grille-tarifaire",
    subscriptions: {
        6: 15.86333333,
        9: 19.88416667,
        12: 23.76083333,
        15: 27.39833333,
        18: 31.1425,
        24: 39.13666667,
        30: 46.47083333,
        36: 53.87666667
    },
    dayTypes: {
        bleu: {
            HP: 28.522,
            HC: 20.777
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
