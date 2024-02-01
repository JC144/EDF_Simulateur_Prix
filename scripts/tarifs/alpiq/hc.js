abonnements.push(
    {
        name: "Alpiq - Heures Creuses",
        lastUpdate: "2024-02-01",
        subscription_url: "https://particuliers.alpiq.fr/electricite/nos-tarifs",
        price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
        prices: [
            {
                puissance: 6,
                abonnement: 13.01,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 9,
                abonnement: 16.70,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 12,
                abonnement: 20.13,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 15,
                abonnement: 23.40,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 18,
                abonnement: 26.64,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 24,
                abonnement: 33.44,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 30,
                abonnement: 39.63,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
                }
            },
            {
                puissance: 36,
                abonnement: 44.79,
                bleu: {
                    prixKwhHP: 23.3280,
                    prixKwhHC: 17.9526
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
