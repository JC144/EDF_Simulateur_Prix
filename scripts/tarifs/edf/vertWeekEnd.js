abonnements.push({
    name: "EDF - Vert Electrique Week-End",
    offer_type: "Marché",
    lastUpdate: "2024-11-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-weekend.pdf",
    prices: [
        { puissance: 6, abonnement: 12.68 },
        { puissance: 9, abonnement: 15.89 },
        { puissance: 12, abonnement: 19.16 },
        { puissance: 15, abonnement: 22.21 },
        { puissance: 18, abonnement: 25.24 },
        { puissance: 24, abonnement: 31.96 },
        { puissance: 30, abonnement: 38.66 },
        { puissance: 36, abonnement: 44.43 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 26.58 },
        weekend: { prixKwhHC: 19.37 }
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
