abonnements.push(
    {
        name: "Enercoop - Base",
        lastUpdate: "2024-02-01",
        subscription_url: "https://souscription.enercoop.fr",
        price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
        prices: [{
            puissance: 3,
            abonnement: 10.10,
            bleu: {
                prixKwhHC: 22.234
            }
        },
        {
            puissance: 6,
            abonnement: 16.02,
            bleu: {
                prixKwhHC: 22.234
            }
        },
        {
            puissance: 9,
            abonnement: 22.28,
            bleu: {
                prixKwhHC: 22.602
            }
        },
        {
            puissance: 12,
            abonnement: 27.68,
            bleu: {
                prixKwhHC: 22.602
            }
        },
        {
            puissance: 15,
            abonnement: 33.65,
            bleu: {
                prixKwhHC: 22.602
            }
        },
        {
            puissance: 18,
            abonnement: 39.62,
            bleu: {
                prixKwhHC: 22.602
            }
        },
        {
            puissance: 24,
            abonnement: 51.57,
            bleu: {
                prixKwhHC: 22.602
            }
        },
        {
            puissance: 30,
            abonnement: 63.51,
            bleu: {
                prixKwhHC: 22.602
            }
        },
        {
            puissance: 36,
            abonnement: 75.46,
            bleu: {
                prixKwhHC: 22.602
            }
        }],
        hc: [{
            start: { hour: 0, minute: 0 },
            end: { hour: 24, minute: 0 }
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

