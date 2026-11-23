defineTarif({
    name: "Dyneff - Contrat+ Électricité - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.dyneff-elec-gaz.fr/particulier/offres-electricite-gaz-particuliers/",
    price_url: "https://www.dyneff-elec-gaz.fr/wp-content/uploads/2026/02/ContratElec_BASE_260801.pdf",
    subscriptions: {
        3: 12.03,
        4: 12.03,
        5: 12.03,
        6: 15.65,
        7: 15.65,
        8: 15.65,
        9: 19.56,
        10: 19.56,
        11: 19.56,
        12: 23.32,
        13: 23.32,
        14: 23.32,
        15: 26.84,
        16: 26.84,
        17: 26.84,
        18: 30.49,
        19: 30.49,
        20: 30.49,
        21: 30.49,
        22: 30.49,
        23: 30.49,
        24: 38.24,
        25: 38.24,
        26: 38.24,
        27: 38.24,
        28: 38.24,
        29: 38.24,
        30: 45.37,
        31: 45.37,
        32: 45.37,
        33: 45.37,
        34: 45.37,
        35: 45.37,
        36: 52.54
    },
    dayTypes: {
        bleu: {
            price: 19.069
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Dyneff - Contrat+ Électricité - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.dyneff-elec-gaz.fr/particulier/offres-electricite-gaz-particuliers/",
    price_url: "https://www.dyneff-elec-gaz.fr/wp-content/uploads/2026/02/ContratElec_HPHC_260801.pdf",
    subscriptions: {
        6: 15.65,
        7: 15.65,
        8: 15.65,
        9: 19.56,
        10: 19.56,
        11: 19.56,
        12: 23.32,
        13: 23.32,
        14: 23.32,
        15: 26.84,
        16: 26.84,
        17: 26.84,
        18: 30.49,
        19: 30.49,
        20: 30.49,
        21: 30.49,
        22: 30.49,
        23: 30.49,
        24: 38.24,
        25: 38.24,
        26: 38.24,
        27: 38.24,
        28: 38.24,
        29: 38.24,
        30: 45.37,
        31: 45.37,
        32: 45.37,
        33: 45.37,
        34: 45.37,
        35: 45.37,
        36: 52.54
    },
    dayTypes: {
        bleu: {
            HP: 19.649,
            HC: 16.034
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "Dyneff - Contrat+ Électricité Verte - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.dyneff-elec-gaz.fr/particulier/offres-electricite-gaz-particuliers/",
    price_url: "https://www.dyneff-elec-gaz.fr/wp-content/uploads/2026/02/ContratElecVerte_BASE_260801.pdf",
    subscriptions: {
        3: 12.03,
        4: 12.03,
        5: 12.03,
        6: 15.65,
        7: 15.65,
        8: 15.65,
        9: 19.56,
        10: 19.56,
        11: 19.56,
        12: 23.32,
        13: 23.32,
        14: 23.32,
        15: 26.84,
        16: 26.84,
        17: 26.84,
        18: 30.49,
        19: 30.49,
        20: 30.49,
        21: 30.49,
        22: 30.49,
        23: 30.49,
        24: 38.24,
        25: 38.24,
        26: 38.24,
        27: 38.24,
        28: 38.24,
        29: 38.24,
        30: 45.37,
        31: 45.37,
        32: 45.37,
        33: 45.37,
        34: 45.37,
        35: 45.37,
        36: 52.54
    },
    dayTypes: {
        bleu: {
            price: 19.369
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Dyneff - Contrat+ Électricité Verte - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.dyneff-elec-gaz.fr/particulier/offres-electricite-gaz-particuliers/",
    price_url: "https://www.dyneff-elec-gaz.fr/wp-content/uploads/2026/02/ContratElecVerte_HPHC_260801.pdf",
    subscriptions: {
        6: 15.65,
        7: 15.65,
        8: 15.65,
        9: 19.56,
        10: 19.56,
        11: 19.56,
        12: 23.32,
        13: 23.32,
        14: 23.32,
        15: 26.84,
        16: 26.84,
        17: 26.84,
        18: 30.49,
        19: 30.49,
        20: 30.49,
        21: 30.49,
        22: 30.49,
        23: 30.49,
        24: 38.24,
        25: 38.24,
        26: 38.24,
        27: 38.24,
        28: 38.24,
        29: 38.24,
        30: 45.37,
        31: 45.37,
        32: 45.37,
        33: 45.37,
        34: 45.37,
        35: 45.37,
        36: 52.54
    },
    dayTypes: {
        bleu: {
            HP: 19.949,
            HC: 16.334
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
