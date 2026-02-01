abonnements.push({
    name: "EDF - Zen Week-End Plus",
    offer_type: "Marché",
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
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
        bleu: {
            prixKwhHC: 21.33
        },
        weekend: {
            prixKwhHC: 16.04
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
    lastUpdate: "2026-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
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
            prixKwhHP: 22.13,
            prixKwhHC: 16.60
        },
        weekend: {
            prixKwhHP: 16.60,
            prixKwhHC: 16.60,
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
