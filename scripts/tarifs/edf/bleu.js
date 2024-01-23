abonnements.push(
    {
        name: "EDF - Bleu",
        lastUpdate: "2023-08-01",
        prices: [{
            puissance: 3,
            abonnement: 9.47,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 9,
            abonnement: 15.63,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 12,
            abonnement: 18.89,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 15,
            abonnement: 21.92,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 18,
            abonnement: 24.92,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 24,
            abonnement: 31.60,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 30,
            abonnement: 37.29,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 36,
            abonnement: 44.66,
            bleu: {
                prixKwhHC: 22.76
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

