abonnements.push(
    {
        name: "OHM Energie - Offre Hype Eco HC",
        offer_type: "Marché",
        lastUpdate: "2024-07-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/06/HYPER-ECO-FIXE.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 15.00,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 9,
            abonnement: 17.55,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 12,
            abonnement: 21.15,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 15,
            abonnement: 24.58,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 18,
            abonnement: 27.98,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 24,
            abonnement: 35.11,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 30,
            abonnement: 41.60,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 36,
            abonnement: 48.15,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 1577
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

