defineTarif({
    name: "Alpiq - Sérénité 100 % verte - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://particuliers.alpiq.fr/cgv",
    price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
    subscriptions: {
        3: 12.13,
        4: 13.37,
        5: 14.62,
        6: 15.86,
        7: 17.2,
        8: 18.54,
        9: 19.88,
        10: 21.18,
        11: 22.47,
        12: 23.76,
        13: 24.97,
        14: 26.19,
        15: 27.4,
        16: 28.65,
        17: 29.89,
        18: 31.14,
        19: 32.47,
        20: 33.81,
        21: 35.14,
        22: 36.47,
        23: 37.8,
        24: 39.14,
        25: 40.36,
        26: 41.58,
        27: 42.8,
        28: 44.03,
        29: 45.25,
        30: 46.47,
        31: 47.7,
        32: 48.94,
        33: 50.17,
        34: 51.41,
        35: 52.64,
        36: 53.88
    },
    dayTypes: {
        bleu: {
            price: 20.3695
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 20.5248
            }
        },
        4: {
            bleu: {
                price: 20.5248
            }
        },
        5: {
            bleu: {
                price: 20.5248
            }
        },
        6: {
            bleu: {
                price: 20.5248
            }
        }
    }
});

defineTarif({
    name: "Alpiq - Sérénité 100 % verte - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://particuliers.alpiq.fr/cgv",
    price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
    subscriptions: {
        6: 15.86,
        7: 17.2,
        8: 18.54,
        9: 19.88,
        10: 21.18,
        11: 22.47,
        12: 23.76,
        13: 24.97,
        14: 26.19,
        15: 27.4,
        16: 28.65,
        17: 29.89,
        18: 31.14,
        19: 32.47,
        20: 33.81,
        21: 35.14,
        22: 36.47,
        23: 37.8,
        24: 39.14,
        25: 40.36,
        26: 41.58,
        27: 42.8,
        28: 44.03,
        29: 45.25,
        30: 46.47,
        31: 47.7,
        32: 48.94,
        33: 50.17,
        34: 51.41,
        35: 52.64,
        36: 53.88
    },
    dayTypes: {
        bleu: {
            HP: 21.9337,
            HC: 16.4293
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
