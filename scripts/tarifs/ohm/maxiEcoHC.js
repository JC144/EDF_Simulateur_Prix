abonnements.push(
    {
        name: "OHM Energie - Offre Maxi Eco HC",
        lastUpdate: "2024-01-17",
        prices: [
        {
            puissance: 6,
            abonnement: 13.00,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 9,
            abonnement: 16.56,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 12,
            abonnement: 20.02,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 15,
            abonnement: 23.34,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 18,
            abonnement: 26.62,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 24,
            abonnement: 33.51,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 30,
            abonnement: 39.78,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
            }
        },
        {
            puissance: 36,
            abonnement: 44.55,
            bleu: {
                prixKwhHP: 19.45,
                prixKwhHC: 14.45
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

