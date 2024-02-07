abonnements.push(
    {
        name: "OHM Energie - Offre Maxi Eco",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/02/ELEC_S%26WE.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.52,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 6,
            abonnement: 12.49,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 9,
            abonnement: 15.68,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 12,
            abonnement: 18.94,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 15,
            abonnement: 21.98,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 18,
            abonnement: 24.99,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 24,
            abonnement: 31.66,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 30,
            abonnement: 37.37,
            bleu: {
                prixKwhHC: 20.40
            }
        },
        {
            puissance: 36,
            abonnement: 44.07,
            bleu: {
                prixKwhHC: 20.40
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

