abonnements.push({
    name: "EDF - Vert Electrique Auto",
    offer_type: "Marché",
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-auto.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-auto.pdf",
    prices: [
        { puissance: 6, abonnement: 15.05 },
        { puissance: 9, abonnement: 18.91 },
        { puissance: 12, abonnement: 22.65 },
        { puissance: 15, abonnement: 26.17 },
        { puissance: 18, abonnement: 29.81 },
        { puissance: 24, abonnement: 37.52 },
        { puissance: 30, abonnement: 44.65 },
        { puissance: 36, abonnement: 51.82 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 22.29,
            prixKwhHC: 13.00
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
