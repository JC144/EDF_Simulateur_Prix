defineTarif({
    name: "OHM Énergie - Classique - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-27",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://souscription.ohm-energie.com/documents/public-document/grid-details/elec-classic-hphc-vert",
    subscriptions: {
        3: 11.04,
        4: 13.16,
        5: 13.69,
        6: 14.45,
        7: 16.77,
        8: 17.31,
        9: 18.11,
        10: 20.35,
        11: 20.88,
        12: 21.65,
        13: 23.71,
        14: 24.21,
        15: 24.97,
        16: 27.12,
        17: 27.63,
        18: 28.39,
        19: 30.77,
        20: 32.19,
        21: 33.41,
        22: 34.31,
        23: 34.88,
        24: 35.68,
        25: 37.85,
        26: 39.15,
        27: 40.27,
        28: 41.09,
        29: 41.61,
        30: 42.37,
        31: 44.56,
        32: 45.88,
        33: 47.01,
        34: 47.84,
        35: 48.36,
        36: 49.13
    },
    dayTypes: {
        bleu: {
            price: 21.48
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 20.01
            }
        },
        4: {
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
    name: "OHM Énergie - Classique - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-27",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://souscription.ohm-energie.com/documents/public-document/grid-details/elec-classic-hphc-vert",
    subscriptions: {
        4: 13.28,
        5: 13.84,
        6: 14.64,
        7: 16.99,
        8: 17.56,
        9: 18.39,
        10: 20.66,
        11: 21.22,
        12: 22.02,
        13: 24.11,
        14: 24.64,
        15: 25.44,
        16: 27.62,
        17: 28.16,
        18: 28.95,
        19: 31.36,
        20: 32.81,
        21: 34.06,
        22: 34.99,
        23: 35.6,
        24: 36.42,
        25: 38.62,
        26: 39.96,
        27: 41.11,
        28: 41.96,
        29: 42.51,
        30: 43.3,
        31: 45.53,
        32: 46.88,
        33: 48.04,
        34: 48.89,
        35: 49.45,
        36: 50.25
    },
    dayTypes: {
        bleu: {
            HP: 23.02,
            HC: 16.99
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
