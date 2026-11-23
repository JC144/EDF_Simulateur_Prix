defineTarif({
    name: "Urban Solar Energy - Essentielle SMB - Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.urbansolarenergy.fr/tarifs/",
    price_url: "https://www.urbansolarenergy.fr/wp-content/uploads/2026/08/TARIFS-SMB-PARTICULIERS-AOUT-2026.pdf",
    subscriptions: {
        3: 12.17,
        6: 15.95,
        9: 20.02,
        12: 23.94,
        15: 27.62,
        18: 31.41,
        24: 39.49,
        30: 46.92,
        36: 54.41
    },
    dayTypes: {
        bleu: {
            price: 21.8
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    }
});

defineTarif({
    name: "Urban Solar Energy - Essentielle SMB - HP/HC",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.urbansolarenergy.fr/tarifs/",
    price_url: "https://www.urbansolarenergy.fr/wp-content/uploads/2026/08/TARIFS-SMB-PARTICULIERS-AOUT-2026.pdf",
    subscriptions: {
        6: 16.18,
        9: 20.35,
        12: 24.96,
        15: 29.75,
        18: 34.55,
        24: 44.14,
        30: 53.73,
        36: 63.32
    },
    dayTypes: {
        bleu: {
            HP: 23.77,
            HC: 17.5
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
