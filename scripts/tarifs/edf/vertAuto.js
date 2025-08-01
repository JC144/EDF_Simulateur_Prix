abonnements.push({
    name: "EDF - Vert Electrique Auto",
    offer_type: "Marché",
    lastUpdate: "2025-08-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-auto.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-auto.pdf",
    prices: [
        { puissance: 6, abonnement: 15.96 },
        { puissance: 9, abonnement: 20.13 },
        { puissance: 12, abonnement: 24.19 },
        { puissance: 15, abonnement: 28.02 },
        { puissance: 18, abonnement: 31.97 },
        { puissance: 24, abonnement: 40.26 },
        { puissance: 30, abonnement: 47.74 },
        { puissance: 36, abonnement: 55.43 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 22.41,
            prixKwhHC: 13.01
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
