abonnements.push({
    name: "EDF - Zen Week-End Plus",
    offer_type: "Marché",
    lastUpdate: "2025-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        { puissance: 6, abonnement: 15.47 },
        { puissance: 9, abonnement: 19.39 },
        { puissance: 12, abonnement: 23.32 },
        { puissance: 15, abonnement: 27.06 },
        { puissance: 18, abonnement: 30.76 },
        { puissance: 24, abonnement: 38.79 },
        { puissance: 30, abonnement: 46.44 },
        { puissance: 36, abonnement: 54.29 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 21.23
        },
        weekend: {
            prixKwhHC: 15.93
        }
    })),
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: true,
    specialDays: [0, 6],
    getDayType: function (day) {
        let dayType = "bleu";

        const isoDate = new Date(day.date);
        const dayOfWeek = isoDate.getDay();

        if (this.specialDays.includes(dayOfWeek)) {
            dayType = "weekend";
        }

        return dayType;
    }
});

abonnements.push({
    name: "EDF - Zen Week-End Plus HC",
    offer_type: "Marché",
    lastUpdate: "2025-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        { puissance: 6, abonnement: 15.74 },
        { puissance: 9, abonnement: 19.81 },
        { puissance: 12, abonnement: 23.76 },
        { puissance: 15, abonnement: 27.49 },
        { puissance: 18, abonnement: 31.34 },
        { puissance: 24, abonnement: 39.47 },
        { puissance: 30, abonnement: 47.02 },
        { puissance: 36, abonnement: 54.61 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 22.03,
            prixKwhHC: 16.50
        },
        weekend: {
            prixKwhHP: 16.50,
            prixKwhHC: 16.50,
        }
    })),
    hc: [{
        start: { hour: 22, minute: 0 },
        end: { hour: 24, minute: 0 }
    },
    {
        start: { hour: 0, minute: 0 },
        end: { hour: 6, minute: 0 }
    }],
    hasHCCustom: true,
    hasSpecialDaysCustom: true,
    specialDays: [0, 6],
    getDayType: function (day) {
        let dayType = "bleu";

        const isoDate = new Date(day.date);
        const dayOfWeek = isoDate.getDay();

        if (this.specialDays.includes(dayOfWeek)) {
            dayType = "weekend";
        }

        return dayType;
    }
});
