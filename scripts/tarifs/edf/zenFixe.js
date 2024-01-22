abonnements.push(
    {
        name: "EDF - Zen Fixe",
        lastUpdate: "2024-01-19",
        shiftTime: 30,        
        prices: [{
            puissance: 3,
            abonnement: 9.47,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 9,
            abonnement: 15.63,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 12,
            abonnement: 18.89,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 15,
            abonnement: 21.92,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 18,
            abonnement: 24.92,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 24,
            abonnement: 31.60,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 30,
            abonnement: 37.28,
            bleu: {
                prixKwhHC: 20.26
            }
        },
        {
            puissance: 36,
            abonnement: 43.99,
            bleu: {
                prixKwhHC: 20.26
            }
        }],
        hc: [{
            start: 0,
            end: 24
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

