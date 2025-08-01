abonnements.push(
    {
        name: "EDF - Zen Fixe",
        offer_type: "Marché",
        lastUpdate: "2025-08-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-fixe.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
        prices: [
            { puissance: 3, abonnement: 11.67 },
            { puissance: 6, abonnement: 15.37 },
            { puissance: 9, abonnement: 19.07 },
            { puissance: 12, abonnement: 22.95 },
            { puissance: 15, abonnement: 26.66 },
            { puissance: 18, abonnement: 30.19 },
            { puissance: 24, abonnement: 38.12 },
            { puissance: 30, abonnement: 46.37 },
            { puissance: 36, abonnement: 52.78 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 18.75 }
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
    name: "EDF - Zen Fixe Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-08-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-fixe.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
    prices: [
        { puissance: 6, abonnement: 15.21 },
        { puissance: 9, abonnement: 18.87 },
        { puissance: 12, abonnement: 22.71 },
        { puissance: 15, abonnement: 26.39 },
        { puissance: 18, abonnement: 30.17 },
        { puissance: 24, abonnement: 37.96 },
        { puissance: 30, abonnement: 45.45 },
        { puissance: 36, abonnement: 52.92 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 19.97,
            prixKwhHC: 15.74
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
