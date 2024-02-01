abonnements.push({
    name: "EDF - Bleu Heures Creuses",
    lastUpdate: "2024-02-01",
    prices: [
        {
            subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html",
            price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_Tarif_Bleu.pdf",
            puissance: 6,
            abonnement: 13.01,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 9,
            abonnement: 16.70,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 12,
            abonnement: 20.13,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 15,
            abonnement: 23.40,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 18,
            abonnement: 26.64,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 24,
            abonnement: 33.44,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 30,
            abonnement: 39.63,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 36,
            abonnement: 44.79,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
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
