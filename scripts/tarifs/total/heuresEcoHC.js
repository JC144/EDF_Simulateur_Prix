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
            start: {hour:22, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:6, minute:0}
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

