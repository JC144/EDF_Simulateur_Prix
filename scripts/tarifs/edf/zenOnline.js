abonnements.push(
    {
        name: "EDF - Zen Online",
        offer_type: "Marché",
        lastUpdate: "2025-02-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
        prices: [
            { puissance: 3, abonnement: 9.77 },
            { puissance: 6, abonnement: 12.80 },
            { puissance: 9, abonnement: 16.37 },
            { puissance: 12, abonnement: 19.79 },
            { puissance: 15, abonnement: 22.98 },
            { puissance: 18, abonnement: 26.16 },
            { puissance: 24, abonnement: 33.17 },
            { puissance: 30, abonnement: 39.19 },
            { puissance: 36, abonnement: 44.98 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 24.55 }
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
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
    prices: [
        { puissance: 6, abonnement: 13.21 },
        { puissance: 9, abonnement: 17.01 },
        { puissance: 12, abonnement: 20.51 },
        { puissance: 15, abonnement: 23.86 },
        { puissance: 18, abonnement: 27.17 },
        { puissance: 24, abonnement: 33.30 },
        { puissance: 30, abonnement: 39.43 },
        { puissance: 36, abonnement: 45.62 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 26.22,
            prixKwhHC: 20.48
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
