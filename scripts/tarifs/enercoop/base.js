abonnements.push(
    {
        name: "Enercoop - Base",
        offer_type: "Marché",
        lastUpdate: "2026-02-16",
        isCommunity: true,
        subscription_url: "https://souscription.enercoop.fr/",
        price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
        prices: [
            { puissance: 1, abonnement: 6.16, bleu: { prixKwhHC: 25.314} },
            { puissance: 2, abonnement: 7.85, bleu: { prixKwhHC: 25.314} },
            { puissance: 3, abonnement: 9.54, bleu: { prixKwhHC: 25.314} },
            { puissance: 4, abonnement: 11.37, bleu: { prixKwhHC: 25.314} },
            { puissance: 5, abonnement: 13.09, bleu: { prixKwhHC: 25.314} },
            { puissance: 6, abonnement: 14.82, bleu: { prixKwhHC: 25.314} },
            { puissance: 7, abonnement: 16.69, bleu: { prixKwhHC: 25.621} },
            { puissance: 8, abonnement: 18.44, bleu: { prixKwhHC: 25.621} },
            { puissance: 9, abonnement: 20.19, bleu: { prixKwhHC: 25.621} },
            { puissance: 10, abonnement: 21.94, bleu: { prixKwhHC: 25.621} },
            { puissance: 11, abonnement: 23.68, bleu: { prixKwhHC: 25.621} },
            { puissance: 12, abonnement: 25.43, bleu: { prixKwhHC: 25.621} },
            { puissance: 13, abonnement: 27.06, bleu: { prixKwhHC: 25.621} },
            { puissance: 14, abonnement: 28.8, bleu: { prixKwhHC: 25.621} },
            { puissance: 15, abonnement: 30.54, bleu: { prixKwhHC: 25.621} },
            { puissance: 16, abonnement: 32.28, bleu: { prixKwhHC: 25.621} },
            { puissance: 17, abonnement: 34.02, bleu: { prixKwhHC: 25.621} },
            { puissance: 18, abonnement: 35.76, bleu: { prixKwhHC: 25.621} },
            { puissance: 19, abonnement: 37.49, bleu: { prixKwhHC: 25.621} },
            { puissance: 20, abonnement: 39.23, bleu: { prixKwhHC: 25.621} },
            { puissance: 21, abonnement: 40.97, bleu: { prixKwhHC: 25.621} },
            { puissance: 22, abonnement: 42.71, bleu: { prixKwhHC: 25.621} },
            { puissance: 23, abonnement: 44.45, bleu: { prixKwhHC: 25.621} },
            { puissance: 24, abonnement: 46.23, bleu: { prixKwhHC: 25.621} },
            { puissance: 25, abonnement: 47.97, bleu: { prixKwhHC: 25.621} },
            { puissance: 26, abonnement: 49.72, bleu: { prixKwhHC: 25.621} },
            { puissance: 27, abonnement: 51.46, bleu: { prixKwhHC: 25.621} },
            { puissance: 28, abonnement: 53.2, bleu: { prixKwhHC: 25.621} },
            { puissance: 29, abonnement: 54.94, bleu: { prixKwhHC: 25.621} },
            { puissance: 30, abonnement: 56.68, bleu: { prixKwhHC: 25.621} },
            { puissance: 31, abonnement: 58.42, bleu: { prixKwhHC: 25.621} },
            { puissance: 32, abonnement: 60.16, bleu: { prixKwhHC: 25.621} },
            { puissance: 33, abonnement: 61.9, bleu: { prixKwhHC: 25.621} },
            { puissance: 34, abonnement: 63.64, bleu: { prixKwhHC: 25.621} },
            { puissance: 35, abonnement: 65.38, bleu: { prixKwhHC: 25.621} },
            { puissance: 36, abonnement: 67.12, bleu: { prixKwhHC: 25.621} }
        ],
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




