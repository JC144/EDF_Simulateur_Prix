abonnements.push(
    {
        name: "Ilek - Base",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.ilek.fr/grilles-tarifaires",
        price_url: "https://ilek.s3.amazonaws.com/uploads/producer/price_list_file/229/grille_electricite.pdf",
        prices: [{
            puissance: 3,
            abonnement: 14.85,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 6,
            abonnement: 20.53,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 9,
            abonnement: 28.01,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 12,
            abonnement: 35.85,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 15,
            abonnement: 41.24,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 18,
            abonnement: 45.28,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 24,
            abonnement: 54.29,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 30,
            abonnement: 64.70,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 36,
            abonnement: 74.03,
            bleu: {
                prixKwhHC: 25.16
            }
        }],
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

