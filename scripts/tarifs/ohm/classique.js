abonnements.push(
    {
        name: "OHM Energie - Offre Classique",
        lastUpdate: "2023-08-01",
        prices: [{
            puissance: 3,
            abonnement: 8.70,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 6,
            abonnement: 11.48,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 9,
            abonnement: 14.46,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 12,
            abonnement: 17.49,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 15,
            abonnement: 20.33,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 18,
            abonnement: 23.14,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 24,
            abonnement: 29.37,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 30,
            abonnement: 34.70,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 36,
            abonnement: 40.95,
            bleu: {
                prixKwhHC: 22.76
            }
        }],
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

