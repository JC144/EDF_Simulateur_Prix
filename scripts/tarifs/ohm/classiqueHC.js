abonnements.push(
    {
        name: "OHM Energie - Offre Classique HC",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2023Octobre/ELEC-Classique_202310.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 12.26,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 9,
            abonnement: 15.58,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 12,
            abonnement: 18.82,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 15,
            abonnement: 21.92,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 18,
            abonnement: 24.99,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 24,
            abonnement: 31.43,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 30,
            abonnement: 37.32,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 36,
            abonnement: 41.67,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
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

