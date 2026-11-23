defineTarif({
    name: "TotalEnergie - Heures Eco+ - Jours Éclair",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-plus-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-heures-eco-plus-particuliers.pdf",
    subscriptions: {
        6: 15.69,
        7: 17,
        8: 18.31,
        9: 19.9,
        10: 21.19,
        11: 22.48,
        12: 24.01,
        13: 25.24,
        14: 26.47,
        15: 27.71,
        16: 28.99,
        17: 30.27,
        18: 31.15,
        19: 32.48,
        20: 33.8,
        21: 35.13,
        22: 36.46,
        23: 37.79,
        24: 39.11,
        25: 40.33,
        26: 41.55,
        27: 42.77,
        28: 43.99,
        29: 45.21,
        30: 46.45,
        31: 47.68,
        32: 48.92,
        33: 50.15,
        34: 51.38,
        35: 52.61,
        36: 52.72
    },
    dayTypes: {
        bleu: {
            HP: 19.77,
            HC: 14.55
        },
        eclair: {
            HP: 19.77,
            HC: 14.55
        },
        vigilance: {
            HP: 63.75,
            HC: 63.75
        }
    },
    dayRule: {
        type: "calendar",
        calendar: "total-eclair",
        default: "bleu",
        hourSubTypes: {
            eclair: [
                {
                    fromHour: 7,
                    toHour: 15,
                    dayType: "vigilance"
                },
                {
                    fromHour: 18,
                    toHour: 20,
                    dayType: "vigilance"
                }
            ]
        }
    },
    hcRanges: "custom"
});
