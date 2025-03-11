abonnements.push({
    name: "EDF - Vert Electrique Week-End",
    offer_type: "Marché",
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    prices: [
        { puissance: 6, abonnement: 13.72 },
        { puissance: 9, abonnement: 17.27 },
        { puissance: 12, abonnement: 20.86 },
        { puissance: 15, abonnement: 24.20 },
        { puissance: 18, abonnement: 27.39 },
        { puissance: 24, abonnement: 34.68 },
        { puissance: 30, abonnement: 43.04 },
        { puissance: 36, abonnement: 48.39 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 21.07
        },
        weekend: {
            prixKwhHC: 15.96
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
    lastUpdate: "2025-03-14",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    prices: [
        { puissance: 6, abonnement: 14.04 },
        { puissance: 9, abonnement: 18.01 },
        { puissance: 12, abonnement: 21.69 },
        { puissance: 15, abonnement: 25.16 },
        { puissance: 18, abonnement: 28.74 },
        { puissance: 24, abonnement: 36.23 },
        { puissance: 30, abonnement: 43.00 },
        { puissance: 36, abonnement: 48.72 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 22.15,
            prixKwhHC: 16.72
        },
        weekend: {
            prixKwhHP: 16.72,
            prixKwhHC: 16.72
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
