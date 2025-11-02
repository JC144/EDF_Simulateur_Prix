abonnements.push(
    {
        name: "La Belle Energie - Garance HC",
        lastUpdate: "2025-11-01",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 17.84,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 9,
            abonnement: 22.31,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 12,
            abonnement: 26.38,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 15,
            abonnement: 30.25,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 18,
            abonnement: 34.23,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 24,
            abonnement: 42.63,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 30,
            abonnement: 50.44,
            bleu: {
                prixKwhHP: 19.07,
                prixKwhHC: 15.07
            }
        },
        {
            puissance: 36,
            abonnement: 58.30,
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

