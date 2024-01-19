abonnements.push(
    {
        name: "TotalEnergie - Heures Eco",
        lastUpdate: "2024-01-01",
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
            abonnement: 15.89,
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
            abonnement: 25.25,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 24,
            abonnement: 32.05,
            bleu: {
                prixKwhHC: 22.76
            }
        },
        {
            puissance: 30,
            abonnement: 37.84,
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

