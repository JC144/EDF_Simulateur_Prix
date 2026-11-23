defineTarif({
    name: "Primeo Energie - Fixe Sereine - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-04",
    isCommunity: true,
    subscription_url: "https://particuliers.primeo-energie.fr/",
    price_url: "https://particuliers.primeo-energie.fr/wp-content/uploads/GT-FD_Offre-Fixe-Sereine.pdf",
    subscriptions: {
        3: 16.31,
        4: 21.62,
        5: 21.62,
        6: 21.62,
        7: 27.35,
        8: 27.35,
        9: 27.35,
        10: 32.83,
        11: 32.83,
        12: 32.83,
        13: 38,
        14: 38,
        15: 38,
        16: 43.32,
        17: 43.32,
        18: 43.32,
        19: 54.68,
        20: 54.68,
        21: 54.68,
        22: 54.68,
        23: 54.68,
        24: 54.68,
        25: 65.09,
        26: 65.09,
        27: 65.09,
        28: 65.09,
        29: 65.09,
        30: 65.09,
        31: 75.61,
        32: 75.61,
        33: 75.61,
        34: 75.61,
        35: 75.61,
        36: 75.61
    },
    dayTypes: {
        bleu: {
            price: 24.64
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 24.75
            }
        },
        4: {
            bleu: {
                price: 24.75
            }
        },
        5: {
            bleu: {
                price: 24.75
            }
        },
        6: {
            bleu: {
                price: 24.75
            }
        }
    }
});

defineTarif({
    name: "Primeo Energie - Fixe Sereine - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-04",
    isCommunity: true,
    subscription_url: "https://particuliers.primeo-energie.fr/",
    price_url: "https://particuliers.primeo-energie.fr/wp-content/uploads/GT-FD_Offre-Fixe-Sereine.pdf",
    subscriptions: {
        3: 21.16,
        4: 21.62,
        5: 21.62,
        6: 21.62,
        7: 27.35,
        8: 27.35,
        9: 27.35,
        10: 32.83,
        11: 32.83,
        12: 32.83,
        13: 38,
        14: 38,
        15: 38,
        16: 43.33,
        17: 43.33,
        18: 43.33,
        19: 54.68,
        20: 54.68,
        21: 54.68,
        22: 54.68,
        23: 54.68,
        24: 54.68,
        25: 65.11,
        26: 65.11,
        27: 65.11,
        28: 65.11,
        29: 65.11,
        30: 65.11,
        31: 75.61,
        32: 75.61,
        33: 75.61,
        34: 75.61,
        35: 75.61,
        36: 75.61
    },
    dayTypes: {
        bleu: {
            HP: 25.59,
            HC: 20.53
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
