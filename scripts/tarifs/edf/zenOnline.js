abonnements.push(
    {
        name: "EDF - Zen Online",
        offer_type: "Marché",
        lastUpdate: "2026-02-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
        prices: [
            { puissance: 3, abonnement: 12.03 },
            { puissance: 6, abonnement: 15.65 },
            { puissance: 9, abonnement: 19.56 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 26.84 },
            { puissance: 18, abonnement: 30.49 },
            { puissance: 24, abonnement: 38.24 },
            { puissance: 30, abonnement: 45.37 },
            { puissance: 36, abonnement: 52.54 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 18.33 }
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
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-online.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-online.pdf",
    prices: [
        { puissance: 6, abonnement: 15.65 },
        { puissance: 9, abonnement: 19.56 },
        { puissance: 12, abonnement: 23.32 },
        { puissance: 15, abonnement: 26.84 },
        { puissance: 18, abonnement: 30.49 },
        { puissance: 24, abonnement: 38.24 },
        { puissance: 30, abonnement: 45.37 },
        { puissance: 36, abonnement: 52.54 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 19.63,
            prixKwhHC: 15.05
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
