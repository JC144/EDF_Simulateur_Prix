abonnements.push(
    {
        name: "OHM Energie - Offre Hyper Eco",
        offer_type: "Marché",
        lastUpdate: "2024-07-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/06/HYPER-ECO-FIXE.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.63,
            bleu: {
                prixKwhHC: 20.64
            }
            },
            {
                puissance: 6,
                abonnement: 12.60,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 9,
                abonnement: 15.79,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 12,
                abonnement: 19.04,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 15,
                abonnement: 22.07,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 18,
                abonnement: 25.08,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 24,
                abonnement: 31.76,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 30,
                abonnement: 37.44,
                bleu: {
                    prixKwhHC: 20.64
                }
            },
            {
                puissance: 36,
                abonnement: 44.15,
                bleu: {
                    prixKwhHC: 20.64
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

