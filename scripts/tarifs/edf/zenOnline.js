abonnements.push(
    {
        name: "EDF - Zen Online",
        offer_type: "Marché",
        lastUpdate: "2025-03-14",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
        prices: [
            { puissance: 3, abonnement: 10.41 },
            { puissance: 6, abonnement: 13.72 },
            { puissance: 9, abonnement: 17.58 },
            { puissance: 12, abonnement: 21.27 },
            { puissance: 15, abonnement: 24.72 },
            { puissance: 18, abonnement: 28.02 },
            { puissance: 24, abonnement: 35.51 },
            { puissance: 30, abonnement: 43.04 },
            { puissance: 36, abonnement: 48.39 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 19.19 }
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
    name: "EDF - Zen Online Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
    prices: [
        { puissance: 6, abonnement: 14.04 },
        { puissance: 9, abonnement: 18.01 },
        { puissance: 12, abonnement: 21.69 },
        { puissance: 15, abonnement: 25.16 },
        { puissance: 18, abonnement: 28.74 },
        { puissance: 24, abonnement: 35.40 },
        { puissance: 30, abonnement: 41.96 },
        { puissance: 36, abonnement: 48.72 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 20.41,
            prixKwhHC: 16.18
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
