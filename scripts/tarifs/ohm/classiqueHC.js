abonnements.push(
    {
        name: "OHM Energie - Offre Classique HC",
        lastUpdate: "2023-08-01",
        prices: [
        {
            puissance: 6,
            abonnement: 12.11,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 9,
            abonnement: 15.43,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 12,
            abonnement: 18.68,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 15,
            abonnement: 21.78,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 18,
            abonnement: 24.85,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 24,
            abonnement: 31.29,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 30,
            abonnement: 37.17,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 36,
            abonnement: 41.53,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
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

