abonnements.push(
    {
        name: "La Belle Energie - Prudence",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.45,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 6,
            abonnement: 12.42,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 9,
            abonnement: 15.61,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 12,
            abonnement: 18.86,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 15,
            abonnement: 21.90,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 18,
            abonnement: 24.91,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 24,
            abonnement: 31.58,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 30,
            abonnement: 37.26,
            bleu: {
                prixKwhHC: 18.78
            }
        },
        {
            puissance: 36,
            abonnement: 43.97,
            bleu: {
                prixKwhHC: 18.78
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

