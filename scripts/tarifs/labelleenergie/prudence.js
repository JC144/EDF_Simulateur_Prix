abonnements.push(
    {
        name: "La Belle Energie - Prudence",
        lastUpdate: "2026-05-07",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 11.13,
            bleu: {
                prixKwhHC: 17.20
            }
        },
        {
            puissance: 6,
            abonnement: 14.75,
            bleu: {
                prixKwhHC: 17.20
            }
        },
        {
            puissance: 9,
            abonnement: 18.66,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 12,
            abonnement: 22.42,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 15,
            abonnement: 25.94,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 18,
            abonnement: 29.59,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 24,
            abonnement: 37.34,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 30,
            abonnement: 44.47,
            bleu: {
                prixKwhHC: 17.08
            }
        },
        {
            puissance: 36,
            abonnement: 51.64,
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

