abonnements.push(
    {
        name: "La Belle Energie - Constance",
        lastUpdate: "2026-05-07",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 13.13,
            bleu: {
                prixKwhHC: 17.20
            }
        },
        {
            puissance: 6,
            abonnement: 16.76,
            bleu: {
                prixKwhHC: 17.20
            }
        },
        {
            puissance: 9,
            abonnement: 20.67,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 12,
            abonnement: 24.42,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 15,
            abonnement: 27.95,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 18,
            abonnement: 31.60,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 24,
            abonnement: 39.35,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 30,
            abonnement: 46.47,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 36,
            abonnement: 53.65,
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

