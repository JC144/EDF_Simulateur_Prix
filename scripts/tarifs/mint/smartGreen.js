defineTarif({
    name: "Mint Energie - Smart & Green",
    offer_type: "Marché",
    lastUpdate: "2026-02-01",
    isCommunity: true,
    eligibility: "Grille de février 2026 pour les titulaires de cette version du contrat.",
    subscription_url: "https://www.mint-energie.com/contrat-electricite/comparaison-offres-electricite/",
    price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_23224_SMART_GREEN.pdf",
    subscriptions: {
        3: 14.24,
        6: 16.49,
        9: 17.55,
        12: 22.2,
        15: 25.66,
        18: 29.11,
        24: 37.22,
        30: 44.73,
        36: 51.64
    },
    dayTypes: {
        bleu: {
            price: 19.63
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Mint Energie - Smart & Green HC",
    offer_type: "Marché",
    lastUpdate: "2026-02-01",
    isCommunity: true,
    eligibility: "Grille de février 2026 pour les titulaires de cette version du contrat.",
    subscription_url: "https://www.mint-energie.com/contrat-electricite/comparaison-offres-electricite/",
    price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_23224_SMART_GREEN.pdf",
    subscriptions: {
        6: 16.67,
        9: 17.82,
        12: 22.56,
        15: 26.11,
        18: 29.65,
        24: 37.95,
        30: 45.64,
        36: 52.73
    },
    dayTypes: {
        bleu: {
            HP: 20.91,
            HC: 16.46
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
