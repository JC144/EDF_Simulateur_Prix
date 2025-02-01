abonnements.push({
    name: "EDF - Vert Electrique Auto",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-auto.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-auto.pdf",
    prices: [
        { puissance: 6, abonnement: 13.42 },
        { puissance: 9, abonnement: 17.01 },
        { puissance: 12, abonnement: 20.51 },
        { puissance: 15, abonnement: 23.86 },
        { puissance: 18, abonnement: 27.17 },
        { puissance: 24, abonnement: 34.13 },
        { puissance: 30, abonnement: 40.47 },
        { puissance: 36, abonnement: 45.62 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 31.06,
            prixKwhHC: 17.56
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