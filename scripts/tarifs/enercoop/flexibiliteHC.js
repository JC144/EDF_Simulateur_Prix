abonnements.push(
    {
        name: "Enercoop - Flexibilité - heures creuses",
        offer_type: "Marché",
        lastUpdate: "2026-02-16",
        isCommunity: true,
        subscription_url: "https://souscription.enercoop.fr/",
        price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
        prices: [
            { puissance: 1, abonnement: 6.6 },
            { puissance: 2, abonnement: 8.75 },
            { puissance: 3, abonnement: 10.89 },
            { puissance: 4, abonnement: 13.4 },
            { puissance: 5, abonnement: 15.64 },
            { puissance: 6, abonnement: 17.87 },
            { puissance: 7, abonnement: 19.68 },
            { puissance: 8, abonnement: 21.86 },
            { puissance: 9, abonnement: 24.03 },
            { puissance: 10, abonnement: 26.21 },
            { puissance: 11, abonnement: 28.38 },
            { puissance: 12, abonnement: 30.56 },
            { puissance: 13, abonnement: 30.87 },
            { puissance: 14, abonnement: 32.9 },
            { puissance: 15, abonnement: 34.94 },
            { puissance: 16, abonnement: 36.97 },
            { puissance: 17, abonnement: 39 },
            { puissance: 18, abonnement: 41.03 },
            { puissance: 19, abonnement: 43.06 },
            { puissance: 20, abonnement: 45.09 },
            { puissance: 21, abonnement: 47.13 },
            { puissance: 22, abonnement: 49.16 },
            { puissance: 23, abonnement: 51.19 },
            { puissance: 24, abonnement: 52.09 },
            { puissance: 25, abonnement: 54.08 },
            { puissance: 26, abonnement: 56.06 },
            { puissance: 27, abonnement: 58.05 },
            { puissance: 28, abonnement: 60.03 },
            { puissance: 29, abonnement: 62.02 },
            { puissance: 30, abonnement: 64 },
            { puissance: 31, abonnement: 65.98 },
            { puissance: 32, abonnement: 67.97 },
            { puissance: 33, abonnement: 69.95 },
            { puissance: 34, abonnement: 71.94 },
            { puissance: 35, abonnement: 73.92 },
            { puissance: 36, abonnement: 75.91 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHP: 27.456, prixKwhHC: 18.95 }
        })),
        hc: [],
        hasHCCustom: true,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    });
