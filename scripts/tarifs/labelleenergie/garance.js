abonnements.push(
    {
        name: "La Belle Energie - Garance",
        lastUpdate: "2026-05-07",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 14.13,
            bleu: {
                prixKwhHC: 17.20
            }
        },
        {
            puissance: 6,
            abonnement: 17.75,
            bleu: {
                prixKwhHC: 17.20
            }
        },
        {
            puissance: 9,
            abonnement: 21.66,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 12,
            abonnement: 25.42,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 15,
            abonnement: 28.94,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 18,
            abonnement: 32.59,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 24,
            abonnement: 40.34,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 30,
            abonnement: 47.47,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 36,
            abonnement: 54.64,
            bleu: {
                prixKwhHC: 17.08
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

