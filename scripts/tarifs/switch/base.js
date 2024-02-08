abonnements.push(
    {
        name: "Switch - Base",
        lastUpdate: "2024-02-08",
        prices: [{
            puissance: 3,
            abonnement: 9.38,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 6,
            abonnement: 12.27,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 9,
            abonnement: 15.38,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 12,
            abonnement: 18.55,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 15,
            abonnement: 21.51,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 18,
            abonnement: 24.45,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 24,
            abonnement: 30.95,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 30,
            abonnement: 36.50,
            bleu: {
                prixKwhHC: 19.95
            }
        },
        {
            puissance: 36,
            abonnement: 43.03,
            bleu: {
                prixKwhHC: 19.95
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

