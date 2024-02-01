abonnements.push(
    {
        name: "La Belle Energie - Constance HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 15.38,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 9,
            abonnement: 18.99,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 12,
            abonnement: 22.52,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 15,
            abonnement: 25.88,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 18,
            abonnement: 29.22,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 24,
            abonnement: 36.22,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 30,
            abonnement: 42.60,
            bleu: {
                prixKwhHP: 22.10,
                prixKwhHC: 17.04
            }
        },
        {
            puissance: 36,
            abonnement: 49.04,
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

