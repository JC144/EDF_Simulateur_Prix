abonnements.push(
    {
        name: "Alterna - Base France",
        lastUpdate: "2024-02-08",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 6,
            abonnement: 12.78,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 9,
            abonnement: 16.06,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 12,
            abonnement: 19.40,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 15,
            abonnement: 22.53,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 18,
            abonnement: 25.63,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 24,
            abonnement: 32.48,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 30,
            abonnement: 38.35,
            bleu: {
                prixKwhHC: 25.39
            }
        },
        {
            puissance: 36,
            abonnement: 45.23,
            bleu: {
                prixKwhHC: 25.39
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

