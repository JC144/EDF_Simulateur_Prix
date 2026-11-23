defineTarif({
    name: "TotalEnergie - Access - Base",
    eligibility: "Cette grille permet de comparer un contrat déjà souscrit.",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-access-particuliers.pdf",
    subscriptions: {
        3: 12.13,
        4: 13.38,
        5: 14.63,
        6: 15.86,
        7: 17.21,
        8: 18.55,
        9: 19.88,
        10: 21.18,
        11: 22.48,
        12: 23.76,
        13: 24.97,
        14: 26.19,
        15: 27.4,
        16: 28.65,
        17: 29.89,
        18: 31.41,
        19: 32.76,
        20: 34.1,
        21: 35.45,
        22: 36.8,
        23: 38.15,
        24: 39.49,
        25: 40.73,
        26: 41.97,
        27: 43.21,
        28: 44.45,
        29: 45.69,
        30: 46.92,
        31: 48.17,
        32: 49.42,
        33: 50.67,
        34: 51.92,
        35: 53.17,
        36: 54.41
    },
    dayTypes: {
        bleu: {
            price: 18.23
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 18.37
            }
        },
        4: {
            bleu: {
                price: 18.37
            }
        },
        5: {
            bleu: {
                price: 18.37
            }
        },
        6: {
            bleu: {
                price: 18.37
            }
        }
    }
});

defineTarif({
    name: "TotalEnergie - Access - HP/HC",
    eligibility: "Cette grille permet de comparer un contrat déjà souscrit.",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-access-particuliers.pdf",
    subscriptions: {
        6: 15.86,
        7: 17.21,
        8: 18.55,
        9: 20.16,
        10: 21.49,
        11: 22.82,
        12: 24.39,
        13: 25.65,
        14: 26.92,
        15: 28.18,
        16: 29.48,
        17: 30.78,
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
        28: 44.9,
        29: 46.16,
        30: 47.4,
        31: 48.67,
        32: 49.94,
        33: 51.2,
        34: 52.47,
        35: 53.74,
        36: 53.88
    },
    dayTypes: {
        bleu: {
            HP: 19.65,
            HC: 14.67
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
