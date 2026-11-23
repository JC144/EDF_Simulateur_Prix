defineTarif({
    name: "Alterna - Mon électricité française indexée - Base",
    eligibility: "Offre indexée correspondant aux contrats détenus. Vérifiez la disponibilité auprès du fournisseur.",
    offer_type: "Marché",
    lastUpdate: "2026-09-01",
    isCommunity: true,
    subscription_url: "https://www.alterna-energie.fr/nos-offres-electricite",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise-indexe",
    subscriptions: {
        3: 13.93,
        6: 17.66,
        9: 22.28,
        12: 26.16,
        15: 29.8,
        18: 33.54,
        24: 41.54,
        30: 48.87,
        36: 56.28
    },
    dayTypes: {
        bleu: {
            price: 19.04
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 19.19
            }
        },
        6: {
            bleu: {
                price: 19.19
            }
        }
    }
});

defineTarif({
    name: "Alterna - Mon électricité française indexée - HP/HC",
    eligibility: "Offre indexée correspondant aux contrats détenus. Vérifiez la disponibilité auprès du fournisseur.",
    offer_type: "Marché",
    lastUpdate: "2026-09-01",
    isCommunity: true,
    subscription_url: "https://www.alterna-energie.fr/nos-offres-electricite",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise-indexe",
    subscriptions: {
        3: 13.93,
        6: 17.66,
        9: 22.56,
        12: 26.53,
        15: 30.26,
        18: 34.1,
        24: 42.28,
        30: 49.8,
        36: 57.39
    },
    dayTypes: {
        bleu: {
            HP: 20.54,
            HC: 15.28
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
