abonnements.push({
    name: "Alterna - Heures Creuses Locale",
    lastUpdate: "2024-02-08",
    prices: [
        {
            puissance: 6,
            abonnement: 14.32,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 9,
            abonnement: 18.12,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 12,
            abonnement: 21.83,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 15,
            abonnement: 25.37,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 18,
            abonnement: 28.87,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 24,
            abonnement: 36.23,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 30,
            abonnement: 42.92,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
            }
        },
        {
            puissance: 36,
            abonnement: 49.66,
            bleu: {
                prixKwhHP: 24.06,
                prixKwhHC: 18.49
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
