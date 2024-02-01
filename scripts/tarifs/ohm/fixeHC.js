abonnements.push(
    {
        name: "OHM Energie - Offre Fixe 1 an HC",
        lastUpdate: "2024-01-02",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "",
        prices: [
        {
            puissance: 6,
            abonnement: 13.69,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 9,
            abonnement: 17.42,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 12,
            abonnement: 21.06,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 15,
            abonnement: 24.54,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 18,
            abonnement: 27.98,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 24,
            abonnement: 35.21,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 30,
            abonnement: 41.79,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
            }
        },
        {
            puissance: 36,
            abonnement: 48.45,
            bleu: {
                prixKwhHP: 30.07,
                prixKwhHC: 18.16
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

