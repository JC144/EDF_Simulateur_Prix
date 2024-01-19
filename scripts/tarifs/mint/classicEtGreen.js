abonnements.push(
    {
        name: "Mint Energie - Classic & Green",
        lastUpdate: "2023-12-12",
        prices: [{
            puissance: 3,
            abonnement: 9.53,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 6,
            abonnement: 12.55,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 9,
            abonnement: 15.80,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 12,
            abonnement: 19.11,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 15,
            abonnement: 22.19,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 18,
            abonnement: 25.25,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 24,
            abonnement: 32.04,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 30,
            abonnement: 37.84,
            bleu: {
                prixKwhHC: 19.14
            }
        },
        {
            puissance: 36,
            abonnement: 44.66,
            bleu: {
                prixKwhHC: 19.14
            }
        }],
        hc: [{
            start: 0,
            end: 24
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

