abonnements.push({
    name: "EDF - Zen Week-End Plus",
    offer_type: "Marché",
    lastUpdate: "2025-08-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        { puissance: 6, abonnement: 15.60 },
        { puissance: 9, abonnement: 19.63 },
        { puissance: 12, abonnement: 23.72 },
        { puissance: 15, abonnement: 27.53 },
        { puissance: 18, abonnement: 31.16 },
        { puissance: 24, abonnement: 39.45 },
        { puissance: 30, abonnement: 47.77 },
        { puissance: 36, abonnement: 55.06 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 21.45            
        },
        weekend: {
            prixKwhHC: 16.10
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
    lastUpdate: "2025-08-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        { puissance: 6, abonnement: 15.96 },
        { puissance: 9, abonnement: 20.13 },
        { puissance: 12, abonnement: 24.19 },
        { puissance: 15, abonnement: 28.02 },
        { puissance: 18, abonnement: 31.97 },
        { puissance: 24, abonnement: 40.26 },
        { puissance: 30, abonnement: 47.74 },
        { puissance: 36, abonnement: 55.43 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 22.25,
            prixKwhHC: 16.65
        },
        weekend: {
            prixKwhHP: 16.65,
            prixKwhHC: 16.65,
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
