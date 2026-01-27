abonnements.push(
    {
        name: "OHM Energie - Offre Extra Eco Fixe",
        offer_type: "Marché",
        lastUpdate: "2026-01-27",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2025/09/ELEC-ExtraECO.pdf",
        prices: [{
            puissance: 3,
            abonnement: 12.75,
            bleu: {
                prixKwhHC: 17.72
            }
            },
            {
                puissance: 6,
                abonnement: 16.79,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 9,
                abonnement: 21.05,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 12,
                abonnement: 25.30,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 15,
                abonnement: 29.35,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 18,
                abonnement: 33.35,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 24,
                abonnement: 42.05,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 30,
                abonnement: 50.34,
                bleu: {
                    prixKwhHC: 17.72
                }
            },
            {
                puissance: 36,
                abonnement: 58.83,
                bleu: {
                    prixKwhHC: 17.72
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

