abonnements.push({
    name: "EDF - Vert Electrique Auto",
    offer_type: "Marché",
    lastUpdate: "2025-10-24",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-auto.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-auto.pdf",
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
            prixKwhHP: 22.19,
            prixKwhHC: 12.90
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
