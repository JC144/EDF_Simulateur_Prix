abonnements.push(
    {
        name: "TotalEnergie - HeuresEco HC",
        lastUpdate: "2024-01-01",
        prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 12,
            abonnement: 20.36,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 15,
            abonnement: 23.73,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
            }
        },
        {
            puissance: 36,
            abonnement: 44.63,
            bleu: {
                prixKwhHP: 25.55,
                prixKwhHC: 16.87
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

