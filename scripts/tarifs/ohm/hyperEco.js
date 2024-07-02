abonnements.push(
    {
        name: "OHM Energie - Offre Hyper Eco",
        offer_type: "Marché",
        lastUpdate: "2024-07-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/06/HYPER-ECO-FIXE.pdf",
        prices: [{
            puissance: 3,
            abonnement: 10.56,
            bleu: {
                prixKwhHC: 18.82
            }
            },
            {
                puissance: 6,
                abonnement: 13.80,
                bleu: {
                    prixKwhHC: 18.82
                }
            },
            {
                puissance: 9,
                abonnement: 16.33,
                bleu: {
                    prixKwhHC: 19.05
                }
            },
            {
                puissance: 12,
                abonnement: 19.69,
                bleu: {
                    prixKwhHC: 19.05
                }
            },
            {
                puissance: 15,
                abonnement: 22.83,
                bleu: {
                    prixKwhHC: 19.05
                }
            },
            {
                puissance: 18,
                abonnement: 25.94,
                bleu: {
                    prixKwhHC: 19.05
                }
            },
            {
                puissance: 24,
                abonnement: 32.84,
                bleu: {
                    prixKwhHC: 19.05
                }
            },
            {
                puissance: 30,
                abonnement: 38.70,
                bleu: {
                    prixKwhHC: 19.05
                }
            },
            {
                puissance: 36,
                abonnement: 45.64,
                bleu: {
                    prixKwhHC: 19.05
                }
            }],
        hc: [{
            start: {hour: 0, minute: 0},
            end: {hour: 24, minute: 0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

