defineTarif({
    name: "La Belle Energie - Constance avec producteur EnR - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        3: 15.63,
        6: 19.37,
        9: 23.39,
        12: 27.27,
        15: 30.9,
        18: 34.65,
        24: 42.64,
        30: 49.97,
        36: 57.38
    },
    dayTypes: {
        bleu: {
            price: 20.85
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 21.01
            }
        },
        6: {
            bleu: {
                price: 21.01
            }
        }
    }
});

defineTarif({
    name: "La Belle Energie - Constance avec producteur EnR - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        6: 19.37,
        9: 23.67,
        12: 27.64,
        15: 31.37,
        18: 35.21,
        24: 43.39,
        30: 50.91,
        36: 58.5
    },
    dayTypes: {
        bleu: {
            HP: 22.42,
            HC: 16.89
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "La Belle Energie - Garance avec producteur EnR - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        3: 17.13,
        6: 20.87,
        9: 24.89,
        12: 28.77,
        15: 32.4,
        18: 36.15,
        24: 44.14,
        30: 51.47,
        36: 58.88
    },
    dayTypes: {
        bleu: {
            price: 20.85
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 21.01
            }
        },
        6: {
            bleu: {
                price: 21.01
            }
        }
    }
});

defineTarif({
    name: "La Belle Energie - Garance avec producteur EnR - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        6: 20.87,
        9: 25.17,
        12: 29.14,
        15: 32.87,
        18: 36.71,
        24: 44.89,
        30: 52.41,
        36: 60
    },
    dayTypes: {
        bleu: {
            HP: 22.42,
            HC: 16.89
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "La Belle Energie - Prudence avec producteur EnR - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        3: 12.13,
        6: 15.86,
        9: 19.88,
        12: 23.76,
        15: 27.4,
        18: 31.14,
        24: 39.14,
        30: 46.47,
        36: 53.88
    },
    dayTypes: {
        bleu: {
            price: 20.85
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 21.01
            }
        },
        6: {
            bleu: {
                price: 21.01
            }
        }
    }
});

defineTarif({
    name: "La Belle Energie - Prudence avec producteur EnR - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        6: 15.86,
        9: 20.16,
        12: 24.13,
        15: 27.86,
        18: 31.7,
        24: 39.88,
        30: 47.4,
        36: 54.99
    },
    dayTypes: {
        bleu: {
            HP: 22.42,
            HC: 16.89
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
