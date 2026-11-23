defineTarif({
    name: "Sélia - Mon Contrat Élec Vert Fixe (Deux-Sèvres) - Base",
    eligibility: "La fourniture dépend de la commune de résidence dans les Deux-Sèvres.",
    offer_type: "Marché",
    lastUpdate: "2026-11-02",
    isCommunity: true,
    subscription_url: "https://www.selia-energies.fr/offre-elec-vert-fixe/",
    price_url: "https://www.selia-energies.fr/wp-content/uploads/2026/11/D-R14-SELIA-SU-25-D-Grille-tarifaire-MCE-vert-fixe.pdf",
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
            price: 31.17
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    priceOverrides: {
        3: {
            bleu: {
                price: 31.44
            }
        },
        6: {
            bleu: {
                price: 31.44
            }
        }
    }
});

defineTarif({
    name: "Sélia - Mon Contrat Élec Vert Fixe (Deux-Sèvres) - HP/HC",
    eligibility: "La fourniture dépend de la commune de résidence dans les Deux-Sèvres.",
    offer_type: "Marché",
    lastUpdate: "2026-11-02",
    isCommunity: true,
    subscription_url: "https://www.selia-energies.fr/offre-elec-vert-fixe/",
    price_url: "https://www.selia-energies.fr/wp-content/uploads/2026/11/D-R14-SELIA-SU-25-D-Grille-tarifaire-MCE-vert-fixe.pdf",
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
            HP: 33.85,
            HC: 24.44
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: "custom"
});
