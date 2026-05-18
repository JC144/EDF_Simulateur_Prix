abonnements.push({
    name: "Alterna - Heures Super Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-05-07",
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-vehicule-electrique",
    prices: [
        { puissance: 6, abonnement: 16.65 },
        { puissance: 9, abonnement: 20.83 },
        { puissance: 12, abonnement: 25.01 },
        { puissance: 15, abonnement: 29.19 },
        { puissance: 18, abonnement: 33.37 },
        { puissance: 24, abonnement: 41.74 },
        { puissance: 30, abonnement: 50.10 },
        { puissance: 36, abonnement: 58.46 }
    ].map(item => ({
        ...item,
        hpEte: { prixKwhHC: 17.80 },
        hcEte: { prixKwhHC: 16.24 },
        hscEte: { prixKwhHP: 13.13 },
        hpHiver: { prixKwhHC: 20.91 },
        hcHiver: { prixKwhHC: 18.27 },
        hscHiver: { prixKwhHC: 16.24 }
    })),
    hc: [{
        start: {hour:0, minute:0},
        end: {hour:24, minute:0}
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day, { hour }) {
        const isoDate = new Date(day.date);
        const month = isoDate.getMonth();
        if (month >= 3 && month < 10) {
            // Ete
            if ((hour >= 7 && hour < 11) || (hour >= 18 && hour < 23)) {
                return "hpEte";
            }
            else if (hour >= 11 && hour < 18) {
                return "hscEte";
            }
            else {
                return "hcEte";
            }
        }
        else {
            // Hiver
            if ((hour >= 7 && hour < 11) || (hour >= 18 && hour < 23)) {
                return "hpHiver";
            }
            else if (hour >= 11 && hour < 18) {
                return "hcHiver";
            }
            else {
                return "hscHiver";
            }
        }
    }
});
