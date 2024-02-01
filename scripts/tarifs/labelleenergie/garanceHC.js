abonnements.push(
    {
        name: "La Belle Energie - Garance HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 18.38,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 9,
            abonnement: 21.99,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 12,
            abonnement: 25.51,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 15,
            abonnement: 28.88,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 18,
            abonnement: 32.21,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 24,
            abonnement: 39.21,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 30,
            abonnement: 45.60,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 36,
            abonnement: 52.03,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        }],
        hc: [{
            start: {hour:22, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:6, minute:0}
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

