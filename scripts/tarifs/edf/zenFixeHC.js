abonnements.push({
    name: "EDF - Zen Fixe Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-01-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-fixe.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.09,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 9,
            abonnement: 16.82,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 12,
            abonnement: 20.28,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 15,
            abonnement: 23.09,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 18,
            abonnement: 26.26,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 24,
            abonnement: 32.92,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 30,
            abonnement: 38.97,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
            }
        },
        {
            puissance: 36,
            abonnement: 45.08,
            bleu: {
                prixKwhHP: 18.76,
                prixKwhHC: 14.56
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
