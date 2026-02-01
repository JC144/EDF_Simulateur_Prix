abonnements.push(
    {
        name: "EDF - Zen Fixe",
        offer_type: "Marché",
        lastUpdate: "2026-02-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-fixe.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
        prices: [
            { puissance: 3, abonnement: 11.25 },
            { puissance: 6, abonnement: 14.78 },
            { puissance: 9, abonnement: 18.49 },
            { puissance: 12, abonnement: 22.21 },
            { puissance: 15, abonnement: 25.74 },
            { puissance: 18, abonnement: 29.23 },
            { puissance: 24, abonnement: 36.84 },
            { puissance: 30, abonnement: 44.07 },
            { puissance: 36, abonnement: 51.50 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 17.74 }
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
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-fixe.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille-prix-zen-fixe.pdf",
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
            prixKwhHP: 18.88,
            prixKwhHC: 14.96
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
