defineTarif({
    name: "OHM Énergie - Prix Réservé - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-16",
    isCommunity: true,
    subscriptionNote: "Réservée aux 20 000 premiers clients particuliers. Activation entre le 1er avril et le 31 mai 2027. Le prix de la part électricité est fixe pendant un an à compter du début de fourniture. Les puissances intermédiaires nécessitent un compteur Linky.",
    subscription_url: "https://ohm-energie.com/prix-reserve-electricite-et-gaz",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-Prix_Reserve.pdf",
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
            price: 18.7
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 18.05
            }
        },
        4: {
            bleu: {
                price: 18.05
            }
        },
        5: {
            bleu: {
                price: 18.05
            }
        },
        6: {
            bleu: {
                price: 18.05
            }
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "OHM Énergie - Prix Réservé - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-16",
    isCommunity: true,
    subscriptionNote: "Réservée aux 20 000 premiers clients particuliers. Activation entre le 1er avril et le 31 mai 2027. Le prix de la part électricité est fixe pendant un an à compter du début de fourniture. Les puissances intermédiaires nécessitent un compteur Linky.",
    subscription_url: "https://ohm-energie.com/prix-reserve-electricite-et-gaz",
    price_url: "https://ohm-energie.com/grilles/elec/2026/11/ELEC-Prix_Reserve.pdf",
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
            HP: 20.27,
            HC: 14.85
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
