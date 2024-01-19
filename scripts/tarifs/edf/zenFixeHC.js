abonnements.push({
    name: "EDF - Zen Fixe Heures Creuses",
    lastUpdate: "2024-01-19",
    prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 30,
            abonnement: 38.56,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
            }
        },
        {
            puissance: 36,
            abonnement: 44.63,
            bleu: {
                prixKwhHP: 22.40,
                prixKwhHC: 16.07
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