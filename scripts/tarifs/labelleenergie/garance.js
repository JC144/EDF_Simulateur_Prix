abonnements.push(
    {
        name: "La Belle Energie - Garance",
        lastUpdate: "2025-11-01",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 13.83,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 6,
            abonnement: 17.57,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 9,
            abonnement: 21.50,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 12,
            abonnement: 25.42,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 15,
            abonnement: 29.16,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 18,
            abonnement: 32.86,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 24,
            abonnement: 40.89,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 30,
            abonnement: 48.54,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 36,
            abonnement: 56.39,
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

