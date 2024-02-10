abonnements.push({
    name: "Ekwateur - Electricité verte fixe HP HC",
    lastUpdate: "2024-01-30",
    prices: [
        {
            puissance: 6,
            abonnement: 16.54,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 9,
            abonnement: 19.95,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 12,
            abonnement: 23.29,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 15,
            abonnement: 26.43,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 18,
            abonnement: 29.69,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 24,
            abonnement: 36.31,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 30,
            abonnement: 45.04,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
            }
        },
        {
            puissance: 36,
            abonnement: 52.8,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 21.12
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
