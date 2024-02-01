abonnements.push(
    {
        name: "OHM Energie - Offre Fixe 1 an",
        lastUpdate: "2024-01-02",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "",
        prices: [{
            puissance: 3,
            abonnement: 9.87,
            bleu: {
                prixKwhHC: 24.02
            }
        },
        {
            puissance: 6,
            abonnement: 13.00,
            bleu: {
                prixKwhHC: 24.02
            }
        },
        {
            puissance: 9,
            abonnement: 16.35,
            bleu: {
                prixKwhHC: 24.39
            }
        },
        {
            puissance: 12,
            abonnement: 19.78,
            bleu: {
                prixKwhHC: 24.39
            }
        },
        {
            puissance: 15,
            abonnement: 22.97,
            bleu: {
                prixKwhHC: 24.39
            }
        },
        {
            puissance: 18,
            abonnement: 26.13,
            bleu: {
                prixKwhHC: 24.39
            }
        },
        {
            puissance: 24,
            abonnement: 33.16,
            bleu: {
                prixKwhHC: 24.39
            }
        },
        {
            puissance: 30,
            abonnement: 39.15,
            bleu: {
                prixKwhHC: 24.39
            }
        },
        {
            puissance: 36,
            abonnement: 46.20,
            bleu: {
                prixKwhHC: 24.39
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

