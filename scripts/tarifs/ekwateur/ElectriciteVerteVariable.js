abonnements.push(
    {
        name: "Ekwateur - Electricité verte variable",
        lastUpdate: "2024-01-30",
        prices: [{
            puissance: 3,
            abonnement: 13.29,
            bleu: {
                prixKwhHC: 29.64
            }
        },
        {
            puissance: 6,
            abonnement: 16.54,
            bleu: {
                prixKwhHC: 29.64
            }
        },
        {
            puissance: 9,
            abonnement: 19.95,
            bleu: {
                prixKwhHC: 33.0
            }
        },
        {
            puissance: 12,
            abonnement: 23.29,
            bleu: {
                prixKwhHC: 33.0
            }
        },
        {
            puissance: 15,
            abonnement: 26.43,
            bleu: {
                prixKwhHC: 33.0
            }
        },
        {
            puissance: 18,
            abonnement: 29.69,
            bleu: {
                prixKwhHC: 33.0
            }
        },
        {
            puissance: 24,
            abonnement: 36.31,
            bleu: {
                prixKwhHC: 33.0
            }
        },
        {
            puissance: 30,
            abonnement: 45.04,
            bleu: {
                prixKwhHC: 33.0
            }
        },
        {
            puissance: 36,
            abonnement: 52.8,
            bleu: {
                prixKwhHC: 33.0
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

