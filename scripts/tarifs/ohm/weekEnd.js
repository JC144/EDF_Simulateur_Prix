defineTarif({
    name: "OHM Énergie - Week-end",
    offer_type: "Marché",
    lastUpdate: "2026-09-04",
    isCommunity: true,
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/09/ELEC-weekend_fixe.pdf",
    subscriptions: {
        3: 12.46,
        4: 14.87,
        5: 15.48,
        6: 16.35,
        7: 18.99,
        8: 19.62,
        9: 20.54,
        10: 23.08,
        11: 23.7,
        12: 24.58,
        13: 26.92,
        14: 27.49,
        15: 28.37,
        16: 30.82,
        17: 31.41,
        18: 32.27,
        19: 34.98,
        20: 36.61,
        21: 37.99,
        22: 39.02,
        23: 39.69,
        24: 40.6,
        25: 43.07,
        26: 44.56,
        27: 45.83,
        28: 46.77,
        29: 47.37,
        30: 48.24,
        31: 50.74,
        32: 52.25,
        33: 53.53,
        34: 54.48,
        35: 55.09,
        36: 55.97
    },
    dayTypes: {
        bleu: {
            HP: 26.5,
            HC: 17.37
        },
        weekend: {
            HP: 17.37,
            HC: 17.37
        }
    },
    dayRule: {
        type: "weekly",
        default: "bleu",
        days: {
            weekend: [
                0,
                6
            ]
        }
    },
    hcRanges: "custom"
});
