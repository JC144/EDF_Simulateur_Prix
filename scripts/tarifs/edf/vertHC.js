abonnements.push({
    name: "EDF - Vert Electrique Heures Creuses",
    lastUpdate: "2023-08-01",
    prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        },
        {
            puissance: 36,
            abonnement: 44.64,
            bleu: {
                prixKwhHP: 25.23,
                prixKwhHC: 18.91
            }
        }],
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});