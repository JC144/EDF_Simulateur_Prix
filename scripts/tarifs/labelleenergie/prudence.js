abonnements.push(
    {
        name: "La Belle Energie - Prudence",
        lastUpdate: "2025-11-01",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 10.83,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 6,
            abonnement: 14.57,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 9,
            abonnement: 18.50,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 12,
            abonnement: 22.42,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 15,
            abonnement: 26.16,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 18,
            abonnement: 29.86,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 24,
            abonnement: 37.89,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 30,
            abonnement: 45.54,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 36,
            abonnement: 53.39,
            bleu: {
                prixKwhHC: 17.91
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

