abonnements.push(
    {
        name: "Alterna - Base Locale",
        lastUpdate: "2024-02-08",
        prices: [{
            puissance: 3,
            abonnement: 10.53,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 6,
            abonnement: 13.87,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 9,
            abonnement: 17.42,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 12,
            abonnement: 21.03,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 15,
            abonnement: 24.40,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 18,
            abonnement: 27.75,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 24,
            abonnement: 35.17,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 30,
            abonnement: 41.50,
            bleu: {
                prixKwhHC: 22.45
            }
        },
        {
            puissance: 36,
            abonnement: 48.95,
            bleu: {
                prixKwhHC: 22.45
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

