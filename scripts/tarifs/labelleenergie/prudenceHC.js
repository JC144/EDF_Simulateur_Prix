abonnements.push(
    {
        name: "La Belle Energie - Prudence HC",
        lastUpdate: "2024-01-10",
        prices: [
        {
            puissance: 6,
            abonnement: 12.86,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 12,
            abonnement: 20.36,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 15,
            abonnement: 23.73,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 24,
            abonnement: 33.29,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 30,
            abonnement: 39.47,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        },
        {
            puissance: 36,
            abonnement: 44.64,
            bleu: {
                prixKwhHP: 19.70,
                prixKwhHC: 14.65
            }
        }],
        hc: [{
            start: {hour:22, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:6, minute:0}
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

