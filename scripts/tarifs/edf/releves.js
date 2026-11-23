defineTarif({
    name: "EDF - Zen Fixe 3 ans - Base",
    offer_type: "Marché",
    lastUpdate: "2026-10-21",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Prix/grille-prix-zen-fixe50.pdf",
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
            price: 20.92
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 21.07
            }
        },
        6: {
            bleu: {
                price: 21.07
            }
        }
    }
});

defineTarif({
    name: "EDF - Zen Fixe 3 ans - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-10-21",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Prix/grille-prix-zen-fixe50.pdf",
    subscriptions: {
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
            HP: 22.59,
            HC: 16.69
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
