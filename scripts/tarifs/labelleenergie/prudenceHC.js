abonnements.push(
    {
        name: "La Belle Energie - Prudence HC",
        lastUpdate: "2026-05-07",
        isCommunity: true,
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 14.75,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 9,
            abonnement: 18.93,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 12,
            abonnement: 22.78,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 15,
            abonnement: 26.40,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 18,
            abonnement: 30.13,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 24,
            abonnement: 38.06,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 30,
            abonnement: 45.37,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
            }
        },
        {
            puissance: 36,
            abonnement: 52.73,
            bleu: {
                prixKwhHP: 18.27,
                prixKwhHC: 14.09
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

