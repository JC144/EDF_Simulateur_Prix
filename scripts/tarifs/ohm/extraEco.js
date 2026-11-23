defineTarif({
    name: "OHM Énergie - Extra Eco - Base",
    offer_type: "Marché",
    lastUpdate: "2026-05-18",
    isCommunity: true,
    eligibility: "Grille publiée le 18 mai 2026. Vérifiez la version appliquée à votre contrat à prix révisable.",
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/05/ELEC-EXTRA_ECO.pdf",
    subscriptions: {
        3: 12.97,
        4: 15.18,
        5: 15.72,
        6: 16.44,
        7: 18.86,
        8: 19.42,
        9: 20.45,
        10: 22.8,
        11: 23.35,
        12: 24.15,
        13: 26.32,
        14: 26.83,
        15: 27.62,
        16: 29.9,
        17: 30.43,
        18: 31.22,
        19: 33.72,
        20: 35.22,
        21: 36.49,
        22: 37.42,
        23: 38.02,
        24: 38.85,
        25: 41.14,
        26: 42.51,
        27: 43.68,
        28: 44.53,
        29: 45.07,
        30: 45.86,
        31: 48.17,
        32: 49.55,
        33: 50.73,
        34: 51.59,
        35: 52.13,
        36: 52.93
    },
    dayTypes: {
        bleu: {
            price: 16.4
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "OHM Énergie - Extra Eco - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-05-18",
    isCommunity: true,
    eligibility: "Grille publiée le 18 mai 2026. Vérifiez la version appliquée à votre contrat à prix révisable.",
    subscription_url: "https://ohm-energie.com/offre/electricite",
    price_url: "https://ohm-energie.com/grilles/elec/2026/05/ELEC-EXTRA_ECO.pdf",
    subscriptions: {
        4: 14.9,
        5: 15.44,
        6: 16.21,
        7: 18.6,
        8: 19.15,
        9: 20.76,
        10: 23.15,
        11: 23.71,
        12: 24.52,
        13: 26.72,
        14: 27.24,
        15: 28.04,
        16: 30.36,
        17: 30.89,
        18: 31.69,
        19: 34.24,
        20: 35.76,
        21: 37.05,
        22: 38,
        23: 38.61,
        24: 39.44,
        25: 41.77,
        26: 43.16,
        27: 44.35,
        28: 45.22,
        29: 45.76,
        30: 46.57,
        31: 48.91,
        32: 50.32,
        33: 51.51,
        34: 52.38,
        35: 52.93,
        36: 53.74
    },
    dayTypes: {
        bleu: {
            HP: 17.66,
            HC: 13.66
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
