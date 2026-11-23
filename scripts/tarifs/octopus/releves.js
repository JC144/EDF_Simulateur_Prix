defineTarif({
    name: "Octopus - Eco Fixe Novembre 2026 (achat groupé) - Base",
    eligibility: "Cette grille est réservée aux participants à l’achat groupé de novembre 2026.",
    offer_type: "Marché",
    lastUpdate: "2026-11-04",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/legal",
    price_url: "https://a.storyblok.com/f/151412/x/a1eb50bef4/grille-tarifaire-cocon_fallback_nov26.pdf",
    subscriptions: {
        1: 9.71,
        2: 10.92,
        3: 12.13,
        4: 13.4,
        5: 14.64,
        6: 15.86,
        7: 17.35,
        8: 18.62,
        9: 19.88,
        10: 21.22,
        11: 22.49,
        12: 23.76,
        13: 24.88,
        14: 26.14,
        15: 27.4,
        16: 28.63,
        17: 29.89,
        18: 31.14,
        19: 32.75,
        20: 34.03,
        21: 35.31,
        22: 36.58,
        23: 37.86,
        24: 39.14,
        25: 40.14,
        26: 41.42,
        27: 42.68,
        28: 43.94,
        29: 45.21,
        30: 46.47,
        31: 47.57,
        32: 48.83,
        33: 50.09,
        34: 51.36,
        35: 52.62,
        36: 54.41
    },
    dayTypes: {
        bleu: {
            price: 20.82
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        1: {
            bleu: {
                price: 20.99
            }
        },
        2: {
            bleu: {
                price: 20.99
            }
        },
        3: {
            bleu: {
                price: 20.99
            }
        },
        4: {
            bleu: {
                price: 20.99
            }
        },
        5: {
            bleu: {
                price: 20.99
            }
        },
        6: {
            bleu: {
                price: 20.99
            }
        }
    }
});

defineTarif({
    name: "Octopus - Eco Fixe Novembre 2026 (achat groupé) - HP/HC",
    eligibility: "Cette grille est réservée aux participants à l’achat groupé de novembre 2026.",
    offer_type: "Marché",
    lastUpdate: "2026-11-04",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/legal",
    price_url: "https://a.storyblok.com/f/151412/x/a1eb50bef4/grille-tarifaire-cocon_fallback_nov26.pdf",
    subscriptions: {
        1: 9.71,
        2: 10.92,
        3: 12.13,
        4: 13.4,
        5: 14.64,
        6: 15.86,
        7: 17.35,
        8: 18.62,
        9: 19.88,
        10: 21.22,
        11: 22.49,
        12: 23.76,
        13: 24.88,
        14: 26.14,
        15: 27.4,
        16: 28.63,
        17: 29.89,
        18: 31.14,
        19: 32.75,
        20: 34.03,
        21: 35.31,
        22: 36.58,
        23: 37.86,
        24: 39.14,
        25: 40.14,
        26: 41.42,
        27: 42.68,
        28: 43.94,
        29: 45.21,
        30: 46.47,
        31: 47.57,
        32: 48.83,
        33: 50.09,
        34: 51.36,
        35: 52.62,
        36: 54.41
    },
    dayTypes: {
        bleu: {
            HP: 22.49,
            HC: 16.62
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
