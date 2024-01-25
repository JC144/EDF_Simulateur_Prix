abonnements.push(
    {
        name: "OHM Energie - Offre Maxi Eco",
        lastUpdate: "2024-01-17",
        prices: [{
            puissance: 3,
            abonnement: 9.36,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 6,
            abonnement: 12.34,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 9,
            abonnement: 15.53,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 12,
            abonnement: 18.78,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 15,
            abonnement: 21.82,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 18,
            abonnement: 24.83,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 24,
            abonnement: 31.51,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 30,
            abonnement: 37.21,
            bleu: {
                prixKwhHC: 18.00
            }
        },
        {
            puissance: 36,
            abonnement: 43.92,
            bleu: {
                prixKwhHC: 18.00
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

