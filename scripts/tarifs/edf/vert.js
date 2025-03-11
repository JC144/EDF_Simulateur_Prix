abonnements.push(
    {
        name: "EDF - Vert Electrique",
        offer_type: "Marché",
        lastUpdate: "2025-03-14",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
        prices: [
            { puissance: 3, abonnement: 10.41 },
            { puissance: 6, abonnement: 13.72 },
            { puissance: 9, abonnement: 17.27 },
            { puissance: 12, abonnement: 20.86 },
            { puissance: 15, abonnement: 24.20 },
            { puissance: 18, abonnement: 27.39 },
            { puissance: 24, abonnement: 34.68 },
            { puissance: 30, abonnement: 41.99 },
            { puissance: 36, abonnement: 48.39 }
        ].map(item => ({
            ...item,
            bleu: {
                prixKwhHC: 19.36
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
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
    prices: [
        { puissance: 6, abonnement: 14.04 },
        { puissance: 9, abonnement: 18.01 },
        { puissance: 12, abonnement: 21.69 },
        { puissance: 15, abonnement: 24.64 },
        { puissance: 18, abonnement: 28.11 },
        { puissance: 24, abonnement: 35.40 },
        { puissance: 30, abonnement: 41.96 },
        { puissance: 36, abonnement: 48.72 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 20.76,
            prixKwhHC: 16.26
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
