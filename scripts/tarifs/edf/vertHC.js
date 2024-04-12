abonnements.push({
    name: "EDF - Vert Electrique Heures Creuses",
    offer_type: "TRV",
    lastUpdate: "2024-03-19",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.01,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 9,
            abonnement: 16.71,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 12,
            abonnement: 20.13,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 15,
            abonnement: 23.40,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 18,
            abonnement: 26.64,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 24,
            abonnement: 33.44,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 30,
            abonnement: 38.73,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        },
        {
            puissance: 36,
            abonnement: 44.79,
            bleu: {
                prixKwhHP: 26.18,
                prixKwhHC: 19.86
            }
        }],
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});