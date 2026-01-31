abonnements.push(
    {
        name: "OHM Energie - Offre Extra Eco Fixe HC",
        offer_type: "Marché",
        lastUpdate: "2025-09-17",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2025/09/ELEC-ExtraECO.pdf",
        prices: [{
            puissance: 6,
            abonnement: 17.36,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 9,
            abonnement: 21.91,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 12,
            abonnement: 26.31,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 15,
            abonnement: 30.49,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 18,
            abonnement: 34.78,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 24,
            abonnement: 43.86,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 30,
            abonnement: 52.29,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
            }
        },
        {
            puissance: 36,
            abonnement: 60.78,
            bleu: {
                prixKwhHP: 18.86,
                prixKwhHC: 14.91
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
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

