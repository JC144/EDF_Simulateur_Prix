abonnements.push(
    {
        name: "Engie - Elec Tranquillité 1 an",
        lastUpdate: "2024-01-01",
        prices: [{
            puissance: 3,
            abonnement: 9.53,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 6,
            abonnement: 12.55,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 9,
            abonnement: 15.80,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 12,
            abonnement: 19.11,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 15,
            abonnement: 22.20,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 18,
            abonnement: 25.25,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 24,
            abonnement: 32.05,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 30,
            abonnement: 37.84,
            bleu: {
                prixKwhHC: 22.764
            }
        },
        {
            puissance: 36,
            abonnement: 44.66,
            bleu: {
                prixKwhHC: 22.764
            }
        }],
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

