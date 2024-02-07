abonnements.push(
    {
        name: "OHM Energie - Offre Classique",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2023Octobre/ELEC-Classique_202310.pdf",
        prices: [{
            puissance: 3,
            abonnement: 8.84,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 6,
            abonnement: 11.62,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 9,
            abonnement: 14.60,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 12,
            abonnement: 17.64,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 15,
            abonnement: 20.47,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 18,
            abonnement: 23.29,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 24,
            abonnement: 29.51,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 30,
            abonnement: 34.84,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 36,
            abonnement: 41.09,
            bleu: {
                prixKwhHC: 25.16
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

