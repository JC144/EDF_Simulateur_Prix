abonnements.push(
    {
        name: "OHM Energie - Offre Maxi Eco HC",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/02/ELEC_S%26WE.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 13.16,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 9,
            abonnement: 16.71,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 12,
            abonnement: 20.18,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 15,
            abonnement: 23.49,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 18,
            abonnement: 26.78,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 24,
            abonnement: 33.66,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 30,
            abonnement: 39.95,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
            }
        },
        {
            puissance: 36,
            abonnement: 44.70,
            bleu: {
                prixKwhHP: 21.85,
                prixKwhHC: 16.85
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

