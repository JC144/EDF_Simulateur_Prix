abonnements.push({
    name: "EDF - Vert Electrique Régional",
    offer_type: "Marché",
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        {
            puissance: 6, abonnement: 13.72,
            bleu: {
                prixKwhHC: 19.61
            }
        },
        {
            puissance: 9, abonnement: 17.27,
            bleu: {
                prixKwhHC: 19.68
            }
        },
        {
            puissance: 12, abonnement: 20.86,
            bleu: {
                prixKwhHC: 19.68
            }
        },
        {
            puissance: 15, abonnement: 24.20,
            bleu: {
                prixKwhHC: 19.68
            }
        },
        {
            puissance: 18, abonnement: 27.39,
            bleu: {
                prixKwhHC: 19.68
            }
        },
        {
            puissance: 24, abonnement: 34.68,
            bleu: {
                prixKwhHC: 19.68
            }
        },
        {
            puissance: 30, abonnement: 41.99,
            bleu: {
                prixKwhHC: 19.68
            }
        },
        {
            puissance: 36, abonnement: 49.64,
            bleu: {
                prixKwhHC: 19.68
            }
        }
    ].map(item => ({
        ...item,

    })),
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

abonnements.push({
    name: "EDF - Vert Electrique Régional Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        { puissance: 6, abonnement: 14.04 },
        { puissance: 9, abonnement: 18.01 },
        { puissance: 12, abonnement: 21.69 },
        { puissance: 15, abonnement: 25.16 },
        { puissance: 18, abonnement: 28.11 },
        { puissance: 24, abonnement: 35.40 },
        { puissance: 30, abonnement: 41.96 },
        { puissance: 36, abonnement: 48.72 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 21.30,
            prixKwhHC: 16.07
        }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});
