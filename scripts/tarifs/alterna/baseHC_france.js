abonnements.push({
    name: "Octopus - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-francaise",
    prices: [
        {
            puissance: 6,
            abonnement: 13.19,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 9,
            abonnement: 16.70,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 12,
            abonnement: 20.13,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 15,
            abonnement: 23.40,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 18,
            abonnement: 26.64,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 24,
            abonnement: 33.44,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 30,
            abonnement: 39.63,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
            }
        },
        {
            puissance: 36,
            abonnement: 45.88,
            bleu: {
                prixKwhHP: 27.24,
                prixKwhHC: 20.86
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
