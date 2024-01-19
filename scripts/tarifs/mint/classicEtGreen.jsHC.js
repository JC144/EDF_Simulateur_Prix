abonnements.push(
    {
        name: "Mint Energie - Classic & Green HC",
        lastUpdate: "2023-12-12",
        prices: [
        {
            puissance: 6,
            abonnement: 13.23,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 9,
            abonnement: 16.84,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 12,
            abonnement: 20.36,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 15,
            abonnement: 23.73,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 18,
            abonnement: 27.06,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 24,
            abonnement: 34.06,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 30,
            abonnement: 40.43,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
            }
        },
        {
            puissance: 36,
            abonnement: 46.88,
            bleu: {
                prixKwhHP: 20.68,
                prixKwhHC: 15.37
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

