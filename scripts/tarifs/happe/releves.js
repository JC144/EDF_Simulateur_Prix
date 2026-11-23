defineTarif({
    name: "Happ-e - Électricité 1 an - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/fiche_descriptive_offre_%C3%A9lectricit%C3%A9_fixe_happ-e.pdf",
    price_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/grille_tarifaire.pdf",
    subscriptions: {
        3: 12.20833333,
        6: 16.145,
        9: 20.08083333,
        12: 24.0175,
        15: 27.95416667,
        18: 31.89,
        24: 39.76333333,
        30: 47.63583333,
        36: 55.50916667
    },
    dayTypes: {
        bleu: {
            price: 26.93
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Happ-e - Électricité 1 an - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/fiche_descriptive_offre_%C3%A9lectricit%C3%A9_fixe_happ-e.pdf",
    price_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/grille_tarifaire.pdf",
    subscriptions: {
        6: 17.8625,
        9: 22.65833333,
        12: 27.45333333,
        15: 32.24916667,
        18: 37.045,
        24: 46.63583333,
        30: 56.22666667,
        36: 65.8175
    },
    dayTypes: {
        bleu: {
            HP: 27.859,
            HC: 23.161
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "Happ-e - Électricité 1 an VertÉlec+ - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/fiche_descriptive_offre_%C3%A9lectricit%C3%A9_fixe_happ-e.pdf",
    price_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/grille_tarifaire.pdf",
    subscriptions: {
        3: 15.20833333,
        6: 19.145,
        9: 23.08083333,
        12: 27.0175,
        15: 30.95416667,
        18: 34.89,
        24: 42.76333333,
        30: 50.63583333,
        36: 58.50916667
    },
    dayTypes: {
        bleu: {
            price: 26.93
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Happ-e - Électricité 1 an VertÉlec+ - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/fiche_descriptive_offre_%C3%A9lectricit%C3%A9_fixe_happ-e.pdf",
    price_url: "https://particuliers.engie.fr/content/dam/happe-public/pdf/grille_tarifaire.pdf",
    subscriptions: {
        6: 20.8625,
        9: 25.65833333,
        12: 30.45333333,
        15: 35.24916667,
        18: 40.045,
        24: 49.63583333,
        30: 59.22666667,
        36: 68.8175
    },
    dayTypes: {
        bleu: {
            HP: 27.859,
            HC: 23.161
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
