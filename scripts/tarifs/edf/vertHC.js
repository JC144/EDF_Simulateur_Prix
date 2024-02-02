abonnements.push({
    name: "EDF - Vert Electrique Heures Creuses",
    offer_type: "TRV",
    lastUpdate: "2024-02-01",
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 30,
            abonnement: 38.56,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
            }
        },
        {
            puissance: 36,
            abonnement: 44.64,
            bleu: {
                prixKwhHP: 27.63,
                prixKwhHC: 21.31
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