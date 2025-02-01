abonnements.push({
    name: "EDF - Vert Electrique Week-End",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    prices: [
        { puissance: 6, abonnement: 12.80 },
        { puissance: 9, abonnement: 16.05 },
        { puissance: 12, abonnement: 19.37 },
        { puissance: 15, abonnement: 22.46 },
        { puissance: 18, abonnement: 25.54 },
        { puissance: 24, abonnement: 32.34 },
        { puissance: 30, abonnement: 39.19 },
        { puissance: 36, abonnement: 44.98 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 28.10
        },
        weekend: {
            prixKwhHC: 20.89
        }
    })),
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
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
    name: "EDF - Vert Electrique Week-End Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    prices: [
        { puissance: 6, abonnement: 13.21 },
        { puissance: 9, abonnement: 17.01 },
        { puissance: 12, abonnement: 20.51 },
        { puissance: 15, abonnement: 23.86 },
        { puissance: 18, abonnement: 27.17 },
        { puissance: 24, abonnement: 34.13 },
        { puissance: 30, abonnement: 40.47 },
        { puissance: 36, abonnement: 45.62 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 29.69,
            prixKwhHC: 22.00
        },
        weekend: {
            prixKwhHP: 22.00,
            prixKwhHC: 22.00
        }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
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
