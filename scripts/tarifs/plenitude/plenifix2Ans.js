defineTarif({
    name: "Plenitude - Plenifix 2 ans (souscription août 2026) - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-03",
    isCommunity: true,
    eligibility: "Grille réservée aux souscriptions du 3 au 24 août 2026 inclus.",
    subscription_url: "https://www.eniplenitude.fr/offres-electricite",
    price_url: "https://www.eniplenitude.fr/content/dam/plenitude-fr/documents/pages-offres/offre-plenifix-2-ans/offre-plenifix_2ans_elec.pdf",
    subscriptions: {
        3: 14.53,
        6: 18.2625,
        9: 22.28333333,
        12: 26.16083333,
        15: 29.7975,
        18: 33.5425,
        24: 41.53583333,
        30: 48.87,
        36: 56.81
    },
    dayTypes: {
        bleu: {
            price: 19.53
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 19.68
            }
        },
        6: {
            bleu: {
                price: 19.68
            }
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Plenitude - Plenifix 2 ans (souscription août 2026) - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-03",
    isCommunity: true,
    eligibility: "Grille réservée aux souscriptions du 3 au 24 août 2026 inclus.",
    subscription_url: "https://www.eniplenitude.fr/offres-electricite",
    price_url: "https://www.eniplenitude.fr/content/dam/plenitude-fr/documents/pages-offres/offre-plenifix-2-ans/offre-plenifix_2ans_elec.pdf",
    subscriptions: {
        6: 18.2625,
        9: 22.56333333,
        12: 26.53333333,
        15: 30.26333333,
        18: 34.10083333,
        24: 42.28166667,
        30: 49.80166667,
        36: 56.27583333
    },
    dayTypes: {
        bleu: {
            HP: 21.067,
            HC: 15.646
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
