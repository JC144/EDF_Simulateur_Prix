abonnements.push(
    {
        name: "La Belle Energie - Prudence",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 6,
            abonnement: 12.71,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 9,
            abonnement: 15.96,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 12,
            abonnement: 19.27,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 15,
            abonnement: 22.35,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 18,
            abonnement: 25.42,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 24,
            abonnement: 32.21,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 30,
            abonnement: 38.00,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 36,
            abonnement: 44.82,
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

