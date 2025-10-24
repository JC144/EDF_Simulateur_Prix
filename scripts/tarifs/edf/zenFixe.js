abonnements.push(
    {
        name: "EDF - Zen Fixe",
        offer_type: "Marché",
        lastUpdate: "2025-10-24",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-fixe.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
        prices: [
            { puissance: 3, abonnement: 11.73 },
            { puissance: 6, abonnement: 15.48 },
            { puissance: 9, abonnement: 19.42 },
            { puissance: 12, abonnement: 23.36 },
            { puissance: 15, abonnement: 27.11 },
            { puissance: 18, abonnement: 30.81 },
            { puissance: 24, abonnement: 38.86 },
            { puissance: 30, abonnement: 46.53 },
            { puissance: 36, abonnement: 54.38 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 19.26 }
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
    lastUpdate: "2025-10-24",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-fixe.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
    prices: [
        { puissance: 6, abonnement: 15.77 },
        { puissance: 9, abonnement: 19.85 },
        { puissance: 12, abonnement: 23.80 },
        { puissance: 15, abonnement: 27.55 },
        { puissance: 18, abonnement: 31.40 },
        { puissance: 24, abonnement: 39.57 },
        { puissance: 30, abonnement: 47.13 },
        { puissance: 36, abonnement: 54.73 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 20.52,
            prixKwhHC: 16.14
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
