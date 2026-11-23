defineTarif({
    name: "Énergie d’ici - Énergie Bleue - Base (CU4)",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.energiedici.fr/nos-offres-pour-les-particuliers.html",
    price_url: "https://www.energiedici.fr/assets/documents/bulletin-adhesion_particuliers_energie-d-ici.pdf",
    subscriptions: {
        3: 12.15,
        6: 15.75,
        9: 19.34,
        12: 22.94,
        15: 26.53,
        18: 30.13,
        24: 37.32,
        30: 44.51,
        36: 51.7
    },
    dayTypes: {
        hiver: {
            HP: 23.28,
            HC: 18.93
        },
        ete: {
            HP: 16.07,
            HC: 15.46
        }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: {
                months: [
                    11,
                    12,
                    1,
                    2,
                    3
                ]
            },
            ete: {
                months: [
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ]
            }
        }
    },
    hcRanges: "custom"
});

defineTarif({
    name: "Énergie d’ici - Énergie Bleue - Heures Creuses (MU4)",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.energiedici.fr/nos-offres-pour-les-particuliers.html",
    price_url: "https://www.energiedici.fr/assets/documents/bulletin-adhesion_particuliers_energie-d-ici.pdf",
    subscriptions: {
        3: 12.87,
        6: 17.18,
        9: 21.49,
        12: 25.8,
        15: 30.11,
        18: 34.41,
        24: 43.03,
        30: 51.65,
        36: 60.27
    },
    dayTypes: {
        hiver: {
            HP: 22.67,
            HC: 18.63
        },
        ete: {
            HP: 16.01,
            HC: 15.39
        }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: {
                months: [
                    11,
                    12,
                    1,
                    2,
                    3
                ]
            },
            ete: {
                months: [
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ]
            }
        }
    },
    hcRanges: "custom"
});
