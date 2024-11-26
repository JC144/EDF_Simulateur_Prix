abonnements.push({
    name: "EDF - Vert Electrique Régional",
    offer_type: "Marché",
    lastUpdate: "2024-11-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 12.68,
            bleu: {
                prixKwhHC: 24.84
            }
        },
        {
            puissance: 9,
            abonnement: 15.89,
            bleu: {
                prixKwhHC: 24.88
            }
        },
        {
            puissance: 12,
            abonnement: 19.16,
            bleu: {
                prixKwhHC: 24.88
            }
        },
        {
            puissance: 15,
            abonnement: 22.21,
            bleu: {
                prixKwhHC: 24.88
            }
        },
        {
            puissance: 18,
            abonnement: 25.24,
            bleu: {
                prixKwhHC: 24.88
            }
        },
        {
            puissance: 24,
            abonnement: 31.96,
            bleu: {
                prixKwhHC: 24.88
            }
        },
        {
            puissance: 30,
            abonnement: 37.68,
            bleu: {
                prixKwhHC: 24.88
            }
        },
        {
            puissance: 36,
            abonnement: 45.60,
            bleu: {
                prixKwhHC: 24.88
            }
        }],
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});