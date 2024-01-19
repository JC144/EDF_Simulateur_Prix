abonnements.push(
    {
        name: "Engie - Elec Tranquillité 1 an HC",
        lastUpdate: "2024-01-01",
        prices: [{
            puissance: 3,
            abonnement: 9.53,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 6,
            abonnement: 12.55,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 9,
            abonnement: 15.80,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 12,
            abonnement: 19.11,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 15,
            abonnement: 22.20,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 18,
            abonnement: 25.25,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 24,
            abonnement: 32.05,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 30,
            abonnement: 37.84,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
            }
        },
        {
            puissance: 36,
            abonnement: 44.66,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 18.276
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

