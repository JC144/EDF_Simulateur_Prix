abonnements.push(
    {
        name: "La Belle Energie - Constance HC",
        lastUpdate: "2025-11-01",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 16.85,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 9,
            abonnement: 21.32,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 12,
            abonnement: 25.39,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 15,
            abonnement: 29.26,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 18,
            abonnement: 33.24,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 24,
            abonnement: 41.64,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 30,
            abonnement: 49.45,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 36,
            abonnement: 57.31,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
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

