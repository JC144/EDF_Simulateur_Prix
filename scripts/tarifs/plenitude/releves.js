defineTarif({
    name: "Plenitude - Plenifix 1 an - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-03",
    isCommunity: true,
    subscription_url: "https://www.eniplenitude.fr/offres-electricite",
    price_url: "https://www.eniplenitude.fr/content/dam/plenitude-fr/documents/pages-offres/offre-plenifix-1-an/offre-plenifix_1an_elec.pdf",
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
            price: 19.85
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 20.006
            }
        },
        6: {
            bleu: {
                price: 20.006
            }
        }
    }
});

defineTarif({
    name: "Plenitude - Plenifix 1 an - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-03",
    isCommunity: true,
    subscription_url: "https://www.eniplenitude.fr/offres-electricite",
    price_url: "https://www.eniplenitude.fr/content/dam/plenitude-fr/documents/pages-offres/offre-plenifix-1-an/offre-plenifix_1an_elec.pdf",
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
            HP: 21.422,
            HC: 15.89
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "Plenitude - Pleniweb 1 an - Base",
    eligibility: "Cette grille permet de comparer un contrat déjà souscrit.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.eniplenitude.fr/offres-electricite",
    price_url: "https://www.eniplenitude.fr/content/dam/plenitude-fr/documents/pages-offres/offre-pleniweb/offre-pleniweb_1an_elec.pdf",
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
            price: 18.233
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 18.373
            }
        },
        6: {
            bleu: {
                price: 18.373
            }
        }
    }
});

defineTarif({
    name: "Plenitude - Pleniweb 1 an - HP/HC",
    eligibility: "Cette grille permet de comparer un contrat déjà souscrit.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.eniplenitude.fr/offres-electricite",
    price_url: "https://www.eniplenitude.fr/content/dam/plenitude-fr/documents/pages-offres/offre-pleniweb/offre-pleniweb_1an_elec.pdf",
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
            HP: 19.648,
            HC: 14.669
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
