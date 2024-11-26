abonnements.push(
    {
        name: "Alpiq - Heures Creuses",
        lastUpdate: "2024-11-26",
        subscription_url: "https://particuliers.alpiq.fr/electricite/nos-tarifs",
        price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
        prices: [
            {
                puissance: 6,
                abonnement: 13.09,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 9,
                abonnement: 16.70,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 12,
                abonnement: 20.28,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 15,
                abonnement: 23.57,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 18,
                abonnement: 26.84,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 24,
                abonnement: 33.70,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 30,
                abonnement: 38.97,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            },
            {
                puissance: 36,
                abonnement: 45.08,
                bleu: {
                    prixKwhHP: 20.6352,
                    prixKwhHC: 15.9554
                }
            }],
        hc: [],
        hasHCCustom: true,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    });
