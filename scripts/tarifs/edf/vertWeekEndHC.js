abonnements.push({
    name: "EDF - Vert Electrique Week-End Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-11-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    prices: [
        { puissance: 6, abonnement: 13.09 },
        { puissance: 9, abonnement: 16.82 },
        { puissance: 12, abonnement: 20.28 },
        { puissance: 15, abonnement: 23.57 },
        { puissance: 18, abonnement: 26.84 },
        { puissance: 24, abonnement: 33.70 },
        { puissance: 30, abonnement: 39.94 },
        { puissance: 36, abonnement: 45.08 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 28.16, prixKwhHC: 20.47 },
        weekend: { prixKwhHP: 20.47, prixKwhHC: 20.47 }
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
