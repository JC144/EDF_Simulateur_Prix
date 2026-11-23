defineTarif({
    name: "mylight150 - Vert de France Bienvenue - Base",
    eligibility: "Remise pendant les 12 premiers mois pour les sites non alimentés par mylight150 au cours des 12 mois précédant la souscription.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        3: 13.31,
        6: 17.08,
        9: 21.15,
        12: 25.07,
        15: 28.75,
        18: 32.54,
        24: 40.62,
        30: 48.05,
        36: 55.54
    },
    dayTypes: {
        bleu: {
            price: 19.85
        }
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
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "mylight150 - Vert de France Bienvenue - HP/HC",
    eligibility: "Remise pendant les 12 premiers mois pour les sites non alimentés par mylight150 au cours des 12 mois précédant la souscription.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        6: 20.7,
        9: 24.79,
        12: 29.56,
        15: 32.55,
        18: 36.97,
        24: 46.37,
        30: 54.26,
        36: 62.26
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

defineTarif({
    name: "mylight150 - Vert de France Bienvenue autoproducteur - Base",
    eligibility: "Remise pendant les 12 premiers mois pour les sites non alimentés par mylight150 au cours des 12 mois précédant la souscription. Auto-producteur individuel sans stockage virtuel. La majoration annuelle est comprise.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        3: 14.294,
        6: 18.064,
        9: 22.134,
        12: 26.054,
        15: 29.734,
        18: 33.524,
        24: 41.604,
        30: 49.034,
        36: 56.524
    },
    dayTypes: {
        bleu: {
            price: 19.85
        }
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
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "mylight150 - Vert de France Bienvenue autoproducteur - HP/HC",
    eligibility: "Remise pendant les 12 premiers mois pour les sites non alimentés par mylight150 au cours des 12 mois précédant la souscription. Auto-producteur individuel sans stockage virtuel. La majoration annuelle est comprise.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        6: 21.684,
        9: 25.774,
        12: 30.544,
        15: 33.534,
        18: 37.954,
        24: 47.354,
        30: 55.244,
        36: 63.244
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

defineTarif({
    name: "mylight150 - Vert de France Standard - Base",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        3: 13.31,
        6: 17.08,
        9: 21.15,
        12: 25.07,
        15: 28.75,
        18: 32.54,
        24: 40.62,
        30: 48.05,
        36: 55.54
    },
    dayTypes: {
        bleu: {
            price: 23.2
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 23.36
            }
        },
        6: {
            bleu: {
                price: 23.36
            }
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "mylight150 - Vert de France Standard - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        6: 20.7,
        9: 24.79,
        12: 29.56,
        15: 32.55,
        18: 36.97,
        24: 46.37,
        30: 54.26,
        36: 62.26
    },
    dayTypes: {
        bleu: {
            HP: 25.4,
            HC: 19
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});

defineTarif({
    name: "mylight150 - Vert de France Standard autoproducteur - Base",
    eligibility: "Auto-producteur individuel sans stockage virtuel. La majoration annuelle est comprise.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        3: 14.294,
        6: 18.064,
        9: 22.134,
        12: 26.054,
        15: 29.734,
        18: 33.524,
        24: 41.604,
        30: 49.034,
        36: 56.524
    },
    dayTypes: {
        bleu: {
            price: 23.2
        }
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 23.36
            }
        },
        6: {
            bleu: {
                price: 23.36
            }
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "mylight150 - Vert de France Standard autoproducteur - HP/HC",
    eligibility: "Auto-producteur individuel sans stockage virtuel. La majoration annuelle est comprise.",
    offer_type: "Marché",
    lastUpdate: "2026-10-01",
    isCommunity: true,
    subscription_url: "https://www.mylight150.com/offres-d-energie",
    price_url: "https://cdn.prod.website-files.com/65f08fc6f2c52e2310a49dcb/6abd2b38f3fe5e9fbd1a3a90_340287e1a8a91a3fa80212e04e747089_GRILLE%20TARIFAIRE%20-%20OCT%202026.pdf",
    subscriptions: {
        6: 21.684,
        9: 25.774,
        12: 30.544,
        15: 33.534,
        18: 37.954,
        24: 47.354,
        30: 55.244,
        36: 63.244
    },
    dayTypes: {
        bleu: {
            HP: 25.4,
            HC: 19
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
