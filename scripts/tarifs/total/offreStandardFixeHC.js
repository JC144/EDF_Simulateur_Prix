abonnements.push(
    {
        name: "TotalEnergie - Offre standard fixe HC",
        lastUpdate: "2024-01-19",
        prices: [
        {
            puissance: 6,
            abonnement: 13.00,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 9,
            abonnement: 16.54,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 15,
            abonnement: 23.21,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 18,
            abonnement: 26.41,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 24,
            abonnement: 33.22,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 30,
            abonnement: 39.27,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
            }
        },
        {
            puissance: 36,
            abonnement: 45.40,
            bleu: {
                prixKwhHP: 20.48,
                prixKwhHC: 15.11
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

