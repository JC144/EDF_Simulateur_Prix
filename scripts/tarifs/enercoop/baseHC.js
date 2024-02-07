abonnements.push(
    {
        name: "Enercoop - Heures Creuses",
        lastUpdate: "2024-02-01",
        subscription_url: "https://souscription.enercoop.fr",
        price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
        prices: [
            {
                puissance: 3,
                abonnement: 11.49,
                bleu: {
                    prixKwhHC: 22.234
                }
            },
            {
                puissance: 6,
                abonnement: 19.19,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 9,
                abonnement: 25.82,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 12,
                abonnement: 31.74,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 15,
                abonnement: 37.67,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 18,
                abonnement: 43.59,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 24,
                abonnement: 55.44,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 30,
                abonnement: 67.29,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
                }
            },
            {
                puissance: 36,
                abonnement: 79.14,
                bleu: {
                    prixKwhHP: 24.758,
                    prixKwhHC: 16.780
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
