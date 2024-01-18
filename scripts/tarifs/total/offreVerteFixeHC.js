abonnements.push(
    {
        name: "TotalEnergie - Offre verte fixe HC",
        lastUpdate: "2024-01-01",
        prices: [
        {
            puissance: 6,
            abonnement: 13.00,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 9,
            abonnement: 16.54,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 15,
            abonnement: 23.21,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 18,
            abonnement: 26.41,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 24,
            abonnement: 33.22,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 30,
            abonnement: 39.27,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        },
        {
            puissance: 36,
            abonnement: 45.40,
            bleu: {
                prixKwhHP: 20.94,
                prixKwhHC: 15.56
            }
        }],
        hc: [{
            start: 22,
            end: 24
        },
        {
            start: 0,
            end: 6
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

