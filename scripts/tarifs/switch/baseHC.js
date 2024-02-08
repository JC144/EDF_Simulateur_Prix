abonnements.push({
    name: "Switch - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.chezswitch.fr/offre-energie/",
    price_url: "https://api.chezswitch.fr/docs/2024.02.01_Grille_tarifaire_des_offres_delectricite.pdf?v=30",
    prices: [
        {
            puissance: 6,
            abonnement: 12.67,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 9,
            abonnement: 16.01,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 12,
            abonnement: 19.26,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 15,
            abonnement: 22.36,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 18,
            abonnement: 25.43,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 24,
            abonnement: 31.88,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 30,
            abonnement: 37.75,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
            }
        },
        {
            puissance: 36,
            abonnement: 43.66,
            bleu: {
                prixKwhHP: 21.36,
                prixKwhHC: 16.50
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
