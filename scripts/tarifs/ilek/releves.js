defineTarif({
    name: "ilek - ÉnRFixe+ - Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-02",
    isCommunity: true,
    subscription_url: "https://www.ilek.fr/offre-electricite",
    price_url: "https://ilek.s3.amazonaws.com/uploads/producer/price_list_file/360/grille_360.pdf",
    subscriptions: {
        3: 18.24,
        6: 25.1,
        9: 34.1,
        12: 43.36,
        15: 49.75,
        18: 54.61,
        24: 65.52,
        30: 78.92,
        36: 88.75
    },
    dayTypes: {
        bleu: {
            price: 26.75
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 26.91
            }
        },
        6: {
            bleu: {
                price: 26.91
            }
        }
    }
});

defineTarif({
    name: "ilek - ÉnRFixe+ - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-02",
    isCommunity: true,
    subscription_url: "https://www.ilek.fr/offre-electricite",
    price_url: "https://ilek.s3.amazonaws.com/uploads/producer/price_list_file/360/grille_360.pdf",
    subscriptions: {
        6: 28.46,
        9: 39.26,
        12: 45.83,
        15: 52.27,
        18: 57.92,
        24: 69.86,
        30: 74.81,
        36: 89.06
    },
    dayTypes: {
        bleu: {
            HP: 28.32,
            HC: 22.79
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
