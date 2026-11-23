defineTarif({
    name: "TotalEnergie - Fixe 3 ans - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-23",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-fixe-3-ans-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-fixe-3ans-particuliers.pdf",
    subscriptions: {
        3: 12.13,
        4: 13.38,
        5: 14.61,
        6: 15.86,
        7: 17.21,
        8: 18.54,
        9: 19.88,
        10: 21.18,
        11: 22.46,
        12: 23.76,
        13: 24.97,
        14: 26.19,
        15: 27.4,
        16: 28.65,
        17: 29.89,
        18: 31.14,
        19: 32.47,
        20: 33.81,
        21: 35.14,
        22: 36.47,
        23: 37.8,
        24: 39.14,
        25: 40.36,
        26: 41.58,
        27: 42.81,
        28: 44.02,
        29: 45.25,
        30: 46.47,
        31: 47.71,
        32: 48.94,
        33: 50.18,
        34: 51.4,
        35: 52.64,
        36: 53.88
    },
    dayTypes: {
        bleu: {
            price: 23.09
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 23.27
            }
        },
        4: {
            bleu: {
                price: 23.27
            }
        },
        5: {
            bleu: {
                price: 23.27
            }
        },
        6: {
            bleu: {
                price: 23.27
            }
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "TotalEnergie - Fixe 3 ans - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-23",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-fixe-3-ans-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-fixe-3ans-particuliers.pdf",
    subscriptions: {
        6: 16.05,
        7: 17.42,
        8: 18.79,
        9: 20.16,
        10: 21.49,
        11: 22.81,
        12: 24.13,
        13: 25.38,
        14: 26.62,
        15: 27.86,
        16: 29.14,
        17: 30.42,
        18: 31.7,
        19: 33.06,
        20: 34.43,
        21: 35.79,
        22: 37.15,
        23: 38.52,
        24: 39.88,
        25: 41.14,
        26: 42.39,
        27: 43.65,
        28: 44.89,
        29: 46.15,
        30: 47.4,
        31: 48.67,
        32: 49.94,
        33: 51.2,
        34: 52.46,
        35: 53.73,
        36: 54.99
    },
    dayTypes: {
        bleu: {
            HP: 24.97,
            HC: 18.33
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
