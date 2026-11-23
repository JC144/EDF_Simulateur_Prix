defineTarif({
    name: "Engie - Élec Adapt 1 an - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/electricite.html",
    price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-adapt.pdf",
    subscriptions: {
        3: 12.13,
        6: 15.8625,
        9: 19.88333333,
        12: 23.76083333,
        15: 27.3975,
        18: 31.1425,
        24: 39.13583333,
        30: 46.47,
        36: 53.87583333
    },
    dayTypes: {
        bleu: {
            price: 21.929
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 22.105
            }
        },
        6: {
            bleu: {
                price: 22.105
            }
        }
    }
});

defineTarif({
    name: "Engie - Élec Adapt 1 an - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/electricite.html",
    price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-adapt.pdf",
    subscriptions: {
        6: 15.8625,
        9: 19.88333333,
        12: 23.76083333,
        15: 27.3975,
        18: 31.1425,
        24: 39.13583333,
        30: 46.47,
        36: 53.87583333
    },
    dayTypes: {
        bleu: {
            HP: 23.704,
            HC: 17.46
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "Engie - Élec’Car 1 an (hors bonus de pilotage) - HP/HC",
    eligibility: "Offre pour véhicule électrique. Le bonus de recharge pilotée dépend des sessions du véhicule.",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://particuliers.engie.fr/electricite.html",
    price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-car.pdf",
    subscriptions: {
        6: 16.04916667,
        9: 20.16333333,
        12: 24.13333333,
        15: 27.86333333,
        18: 31.70083333,
        24: 39.88083333,
        30: 47.40166667,
        36: 54.99333333
    },
    dayTypes: {
        bleu: {
            HP: 26.682,
            HC: 15.179
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
