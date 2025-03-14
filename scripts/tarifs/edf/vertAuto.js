abonnements.push({
    name: "EDF - Vert Electrique Auto",
    offer_type: "Marché",
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-auto.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-auto.pdf",
    prices: [
        { puissance: 6, abonnement: 14.24 },
        { puissance: 9, abonnement: 18.01 },
        { puissance: 12, abonnement: 21.69 },
        { puissance: 15, abonnement: 25.16 },
        { puissance: 18, abonnement: 28.74 },
        { puissance: 24, abonnement: 36.23 },
        { puissance: 30, abonnement: 43.00 },
        { puissance: 36, abonnement: 48.72 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 22.86,
            prixKwhHC: 13.45
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
