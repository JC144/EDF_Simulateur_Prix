abonnements.push({
    name: "EDF - Vert Electrique Régional",
    offer_type: "Marché",
    lastUpdate: "2025-10-24",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        { puissance: 6, abonnement: 15.47 },
        { puissance: 9, abonnement: 19.39 },
        { puissance: 12, abonnement: 23.32 },
        { puissance: 15, abonnement: 27.06 },
        { puissance: 18, abonnement: 30.76 },
        { puissance: 24, abonnement: 38.79 },
        { puissance: 30, abonnement: 46.44 },
        { puissance: 36, abonnement: 54.29 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 19.04
        }
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
    lastUpdate: "2025-10-24",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        { puissance: 6, abonnement: 15.74 },
        { puissance: 9, abonnement: 19.81 },
        { puissance: 12, abonnement: 23.76 },
        { puissance: 15, abonnement: 27.49 },
        { puissance: 18, abonnement: 31.34 },
        { puissance: 24, abonnement: 39.47 },
        { puissance: 30, abonnement: 47.02 },
        { puissance: 36, abonnement: 54.61 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 20.95,
            prixKwhHC: 15.05
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
