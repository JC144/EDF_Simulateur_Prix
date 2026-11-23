defineTarif({
    name: "GEG - Élec Verte fixe 3 ans - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-12",
    isCommunity: true,
    subscription_url: "https://www.geg.fr/electricite/",
    price_url: "https://www.geg.fr/Medias/content-editor/Tarif%20Part/2026/Novembre/Grille-tarifaire-Mes%20Offres%20Elec%20fixes%203%20ans-PART1126.pdf",
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
            price: 22.68
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 24.25
            }
        },
        6: {
            bleu: {
                price: 23.3
            }
        },
        9: {
            bleu: {
                price: 23.06
            }
        },
        12: {
            bleu: {
                price: 22.92
            }
        },
        15: {
            bleu: {
                price: 22.86
            }
        },
        18: {
            bleu: {
                price: 22.82
            }
        },
        24: {
            bleu: {
                price: 22.71
            }
        },
        30: {
            bleu: {
                price: 22.69
            }
        }
    }
});

defineTarif({
    name: "GEG - Élec Verte fixe 3 ans - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-12",
    isCommunity: true,
    subscription_url: "https://www.geg.fr/electricite/",
    price_url: "https://www.geg.fr/Medias/content-editor/Tarif%20Part/2026/Novembre/Grille-tarifaire-Mes%20Offres%20Elec%20fixes%203%20ans-PART1126.pdf",
    subscriptions: {
        6: 16.05,
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
            HP: 24.5,
            HC: 20.46
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "GEG - Élec Verte Direct Producteur fixe 3 ans - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-12",
    isCommunity: true,
    subscription_url: "https://www.geg.fr/electricite/",
    price_url: "https://www.geg.fr/Medias/content-editor/Tarif%20Part/2026/Novembre/Grille-tarifaire-Mes%20Offres%20Elec%20fixes%203%20ans-PART1126.pdf",
    subscriptions: {
        3: 13.24,
        6: 17.3,
        9: 21.67,
        12: 25.89,
        15: 29.84,
        18: 33.92,
        24: 42.61,
        30: 50.59,
        36: 58.64
    },
    dayTypes: {
        bleu: {
            price: 22.59
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 23.49
            }
        },
        6: {
            bleu: {
                price: 22.88
            }
        },
        9: {
            bleu: {
                price: 22.82
            }
        },
        12: {
            bleu: {
                price: 22.72
            }
        },
        15: {
            bleu: {
                price: 22.7
            }
        },
        18: {
            bleu: {
                price: 22.67
            }
        }
    }
});

defineTarif({
    name: "GEG - Élec Verte Direct Producteur fixe 3 ans - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-12",
    isCommunity: true,
    subscription_url: "https://www.geg.fr/electricite/",
    price_url: "https://www.geg.fr/Medias/content-editor/Tarif%20Part/2026/Novembre/Grille-tarifaire-Mes%20Offres%20Elec%20fixes%203%20ans-PART1126.pdf",
    subscriptions: {
        6: 17.48,
        9: 21.95,
        12: 26.26,
        15: 30.31,
        18: 34.47,
        24: 43.36,
        30: 51.52,
        36: 59.76
    },
    dayTypes: {
        bleu: {
            HP: 20.4,
            HC: 16.94
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "GEG - Tarif Bleu (zone GEG) - Base",
    eligibility: "Le Tarif Bleu de GEG est réservé aux communes de sa zone de desserte.",
    offer_type: "TRV",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.geg.fr/tarif-reglemente-de-vente-d-electricite/",
    price_url: "https://www.geg.fr/Medias/tarifs/Grille-tarifaire-Mon%20Offre%20Tarif%20R%C3%A9glement%C3%A9e%20Bleue%20PART0826.pdf",
    subscriptions: {
        3: 12.15,
        6: 15.9,
        9: 19.99,
        12: 23.9,
        15: 27.55,
        18: 31.32,
        24: 39.43,
        30: 46.79,
        36: 54.23
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
                price: 20.01
            }
        },
        6: {
            bleu: {
                price: 20.01
            }
        }
    }
});

defineTarif({
    name: "GEG - Tarif Bleu (zone GEG) - HP/HC",
    eligibility: "Le Tarif Bleu de GEG est réservé aux communes de sa zone de desserte.",
    offer_type: "TRV",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.geg.fr/tarif-reglemente-de-vente-d-electricite/",
    price_url: "https://www.geg.fr/Medias/tarifs/Grille-tarifaire-Mon%20Offre%20Tarif%20R%C3%A9glement%C3%A9e%20Bleue%20PART0826.pdf",
    subscriptions: {
        3: 12.22,
        6: 16.05,
        9: 20.16,
        12: 24.13,
        15: 27.86,
        18: 31.7,
        24: 39.84,
        30: 47.4,
        36: 54.99
    },
    dayTypes: {
        bleu: {
            HP: 21.42,
            HC: 15.89
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
