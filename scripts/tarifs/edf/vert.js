abonnements.push(
    {
        name: "EDF - Vert Electrique",
        offer_type: "Marché",
        lastUpdate: "2025-02-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
        prices: [
            { puissance: 3, abonnement: 9.77 },
            { puissance: 6, abonnement: 12.80 },
            { puissance: 9, abonnement: 16.05 },
            { puissance: 12, abonnement: 19.37 },
            { puissance: 15, abonnement: 22.46 },
            { puissance: 18, abonnement: 25.54 },
            { puissance: 24, abonnement: 32.34 },
            { puissance: 30, abonnement: 38.14 },
            { puissance: 36, abonnement: 44.98 }
        ].map(item => ({
            ...item,
            bleu: {
                prixKwhHC: 25.75
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
    }
);

abonnements.push({
    name: "EDF - Vert Electrique Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
    prices: [
        { puissance: 6, abonnement: 13.21 },
        { puissance: 9, abonnement: 17.01 },
        { puissance: 12, abonnement: 20.51 },
        { puissance: 15, abonnement: 23.34 },
        { puissance: 18, abonnement: 26.55 },
        { puissance: 24, abonnement: 33.30 },
        { puissance: 30, abonnement: 39.43 },
        { puissance: 36, abonnement: 45.62 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 27.71,
            prixKwhHC: 21.38
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