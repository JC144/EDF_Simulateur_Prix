defineTarif({
    name: "OHM Énergie - Premi’Ohm - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-13",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-PremiOhm.pdf",
    subscriptions: {
        3: 12.15,
        4: 14.48,
        5: 15.05,
        6: 15.88,
        7: 18.44,
        8: 19.02,
        9: 19.9,
        10: 22.36,
        11: 22.94,
        12: 23.78,
        13: 26.05,
        14: 26.58,
        15: 27.42,
        16: 29.79,
        17: 30.34,
        18: 31.16,
        19: 33.79,
        20: 35.35,
        21: 36.69,
        22: 37.67,
        23: 38.29,
        24: 39.16,
        25: 41.55,
        26: 42.99,
        27: 44.21,
        28: 45.1,
        29: 45.66,
        30: 46.49,
        31: 48.91,
        32: 50.36,
        33: 51.59,
        34: 52.49,
        35: 53.06,
        36: 53.89
    },
    dayTypes: {
        bleu: {
            price: 23.24
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "OHM Énergie - Premi’Ohm - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-13",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-PremiOhm.pdf",
    subscriptions: {
        4: 14.61,
        5: 15.21,
        6: 16.07,
        7: 18.66,
        8: 19.27,
        9: 20.18,
        10: 22.68,
        11: 23.28,
        12: 24.15,
        13: 26.45,
        14: 27.02,
        15: 27.88,
        16: 30.29,
        17: 30.87,
        18: 31.72,
        19: 34.38,
        20: 35.98,
        21: 37.34,
        22: 38.35,
        23: 39.01,
        24: 39.9,
        25: 42.33,
        26: 43.79,
        27: 45.05,
        28: 45.97,
        29: 46.56,
        30: 47.42,
        31: 49.87,
        32: 51.35,
        33: 52.62,
        34: 53.55,
        35: 54.15,
        36: 55.01
    },
    dayTypes: {
        bleu: {
            HP: 25.06,
            HC: 18.21
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "OHM Énergie - Sérénité Fixe 1 an - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-12",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-Serenite_Fixe_1an.pdf",
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
            price: 22.51
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
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
        },
        5: {
            bleu: {
                price: 20.01
            }
        }
    }
});

defineTarif({
    name: "OHM Énergie - Sérénité Fixe 1 an - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-12",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-Serenite_Fixe_1an.pdf",
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
            HP: 24.48,
            HC: 17.78
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "OHM Énergie - Sérénité Fixe 2 ans - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-13",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-Serenite_Fixe_2ans.pdf",
    subscriptions: {
        3: 12.15,
        4: 14.48,
        5: 15.05,
        6: 15.88,
        7: 18.44,
        8: 19.02,
        9: 19.9,
        10: 22.36,
        11: 22.94,
        12: 23.78,
        13: 26.05,
        14: 26.58,
        15: 27.42,
        16: 29.79,
        17: 30.34,
        18: 31.16,
        19: 33.79,
        20: 35.35,
        21: 36.69,
        22: 37.67,
        23: 38.29,
        24: 39.16,
        25: 41.55,
        26: 42.99,
        27: 44.21,
        28: 45.1,
        29: 45.66,
        30: 46.49,
        31: 48.91,
        32: 50.36,
        33: 51.59,
        34: 52.49,
        35: 53.06,
        36: 53.89
    },
    dayTypes: {
        bleu: {
            price: 22.85
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "OHM Énergie - Sérénité Fixe 2 ans - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-13",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-Serenite_Fixe_2ans.pdf",
    subscriptions: {
        4: 14.61,
        5: 15.21,
        6: 16.07,
        7: 18.66,
        8: 19.27,
        9: 20.18,
        10: 22.68,
        11: 23.28,
        12: 24.15,
        13: 26.45,
        14: 27.02,
        15: 27.88,
        16: 30.29,
        17: 30.87,
        18: 31.72,
        19: 34.38,
        20: 35.98,
        21: 37.34,
        22: 38.35,
        23: 39.01,
        24: 39.9,
        25: 42.33,
        26: 43.79,
        27: 45.05,
        28: 45.97,
        29: 46.56,
        30: 47.42,
        31: 49.87,
        32: 51.35,
        33: 52.62,
        34: 53.55,
        35: 54.15,
        36: 55.01
    },
    dayTypes: {
        bleu: {
            HP: 24.69,
            HC: 18.03
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
