abonnements.push(
    {
        name: "La Belle Energie - Constance",
        lastUpdate: "2025-11-01",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 12.83,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 6,
            abonnement: 16.57,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 9,
            abonnement: 20.50,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 12,
            abonnement: 24.43,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 15,
            abonnement: 28.16,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 18,
            abonnement: 31.87,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 24,
            abonnement: 39.89,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 30,
            abonnement: 47.55,
            bleu: {
                prixKwhHC: 17.91
            }
        },
        {
            puissance: 36,
            abonnement: 55.39,
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

