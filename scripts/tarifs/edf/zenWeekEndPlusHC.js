abonnements.push({
    name: "EDF - Zen Week-End Plus HC",
    offer_type: "Marché",
    lastUpdate: "2024-12-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        { puissance: 6, abonnement: 13.09 },
        { puissance: 9, abonnement: 16.82 },
        { puissance: 12, abonnement: 20.28 },
        { puissance: 15, abonnement: 23.57 },
        { puissance: 18, abonnement: 26.84 },
        { puissance: 24, abonnement: 33.70 },
        { puissance: 30, abonnement: 39.94 },
        { puissance: 36, abonnement: 46.24 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 28.88, prixKwhHC: 20.98 },
        weekend: { prixKwhHP: 20.98, prixKwhHC: 20.98 }
    })),
    hc: [
        { start: { hour: 22, minute: 0 }, end: { hour: 24, minute: 0 } },
        { start: { hour: 0, minute: 0 }, end: { hour: 6, minute: 0 } }
    ],
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
