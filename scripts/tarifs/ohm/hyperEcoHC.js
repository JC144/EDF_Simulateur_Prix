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
            abonnement: 13.19,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 9,
            abonnement: 16.70,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 12,
            abonnement: 20.13,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 15,
            abonnement: 23.40,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 18,
            abonnement: 26.64,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 24,
            abonnement: 33.44,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 30,
            abonnement: 39.63,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 36,
            abonnement: 45.87,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
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

