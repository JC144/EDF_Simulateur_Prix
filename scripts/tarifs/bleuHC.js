abonnements.push({
    name: "Bleu Heures Creuses",
    prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        },
        {
            puissance: 36,
            abonnement: 44.64,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.28
            }
        }],
    hc: [{
        start: 22,
        end: 24
    },
    {
        start: 0,
        end: 7
    }],
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});