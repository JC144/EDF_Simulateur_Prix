abonnements.push({
    name: "EDF - Zen Week-End Plus",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [        
        { puissance: 6, abonnement: 12.80 },
        { puissance: 9, abonnement: 16.37 },
        { puissance: 12, abonnement: 19.79 },
        { puissance: 15, abonnement: 22.46 },
        { puissance: 18, abonnement: 26.16 },
        { puissance: 24, abonnement: 33.17 },
        { puissance: 30, abonnement: 38.14 },
        { puissance: 36, abonnement: 44.98 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 29.30
        },
        weekend: {
            prixKwhHC: 21.73
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
    lastUpdate: "2024-12-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [        
        { puissance: 6, abonnement: 13.21 },
        { puissance: 9, abonnement: 17.01 },
        { puissance: 12, abonnement: 20.51 },
        { puissance: 15, abonnement: 23.86 },
        { puissance: 18, abonnement: 27.17 },
        { puissance: 24, abonnement: 34.13 },
        { puissance: 30, abonnement: 40.47 },
        { puissance: 36, abonnement: 46.87 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 30.41,
            prixKwhHC: 22.50
        },
        weekend: {
            prixKwhHP: 22.50,
            prixKwhHC: 22.50,
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