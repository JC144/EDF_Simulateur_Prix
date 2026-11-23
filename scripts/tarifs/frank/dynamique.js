defineTarif({
    name: "Frank Énergie - Dynamique CU4",
    marketIndex: {
        source: "epex-fr",
        vat: 1.2
    },
    offer_type: "Marché",
    lastUpdate: "2026-11-23",
    isCommunity: true,
    subscription_url: "https://www.frankenergie.fr/fr/tarification-dynamique",
    price_url: "https://cdn.sanity.io/files/8navd656/production-fr/7186cef7994ce2ba46c482cdd338ad25cb095dee.pdf",
    subscriptions: {
        3: 14.17,
        4: 15.37,
        5: 16.57,
        6: 17.77,
        7: 18.96,
        8: 20.16,
        9: 21.36,
        10: 22.56,
        11: 23.76,
        12: 24.96,
        13: 26.15,
        14: 27.35,
        15: 28.55,
        16: 29.75,
        17: 30.95,
        18: 32.15,
        19: 33.34,
        20: 34.54,
        21: 35.74,
        22: 36.94,
        23: 38.14,
        24: 39.34,
        25: 40.53,
        26: 41.73,
        27: 42.93,
        28: 44.13,
        29: 45.33,
        30: 46.52,
        31: 47.72,
        32: 48.92,
        33: 50.12,
        34: 51.32,
        35: 52.52
    },
    dayTypes: {
        hiver: {
            HP: 15.2184,
            HC: 10.8624
        },
        ete: {
            HP: 8.0064,
            HC: 7.3944
        }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: {
                months: [
                    11,
                    12,
                    1,
                    2,
                    3
                ]
            },
            ete: {
                months: [
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ]
            }
        }
    },
    hcRanges: "custom"
});

defineTarif({
    name: "Frank Énergie - Dynamique MU4",
    marketIndex: {
        source: "epex-fr",
        vat: 1.2
    },
    offer_type: "Marché",
    lastUpdate: "2026-11-23",
    isCommunity: true,
    subscription_url: "https://www.frankenergie.fr/fr/tarification-dynamique",
    price_url: "https://cdn.sanity.io/files/8navd656/production-fr/7186cef7994ce2ba46c482cdd338ad25cb095dee.pdf",
    subscriptions: {
        3: 14.88,
        4: 16.32,
        5: 17.76,
        6: 19.19,
        7: 20.63,
        8: 22.07,
        9: 23.5,
        10: 24.94,
        11: 26.38,
        12: 27.81,
        13: 29.25,
        14: 30.68,
        15: 32.12,
        16: 33.56,
        17: 34.99,
        18: 36.43,
        19: 37.87,
        20: 39.3,
        21: 40.74,
        22: 42.18,
        23: 43.61,
        24: 45.05,
        25: 46.48,
        26: 47.92,
        27: 49.36,
        28: 50.79,
        29: 52.23,
        30: 53.67,
        31: 55.1,
        32: 56.54,
        33: 57.98,
        34: 59.41,
        35: 60.85
    },
    dayTypes: {
        hiver: {
            HP: 14.6064,
            HC: 10.5624
        },
        ete: {
            HP: 7.9464,
            HC: 7.3224
        }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: {
                months: [
                    11,
                    12,
                    1,
                    2,
                    3
                ]
            },
            ete: {
                months: [
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ]
            }
        }
    },
    hcRanges: "custom"
});
