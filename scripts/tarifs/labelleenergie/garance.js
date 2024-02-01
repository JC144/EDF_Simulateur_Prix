abonnements.push(
    {
        name: "La Belle Energie - Garance",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 14.68,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 6,
            abonnement: 17.70,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 9,
            abonnement: 20.95,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 12,
            abonnement: 24.26,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 15,
            abonnement: 27.34,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 18,
            abonnement: 30.41,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 24,
            abonnement: 37.20,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 30,
            abonnement: 42.99,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 36,
            abonnement: 49.81,
            bleu: {
                prixKwhHC: 20.64
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

