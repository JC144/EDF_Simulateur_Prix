abonnements.push({
    name: "Enercoop - Offre Flexibilité 2 Saisons",
    offer_type: "Marché",
    isCommunity: false,
    lastUpdate: "2026-02-26",
    subscription_url: "https://www.faq.enercoop.fr/hc/fr",
    price_url: "https://www.faq.enercoop.fr/hc/fr/article_attachments/34072541524114",
    prices: [
        { puissance: 3, abonnement: 10.02 },
        { puissance: 6, abonnement: 15.86 },
        { puissance: 9, abonnement: 21.22 },
        { puissance: 12, abonnement: 26.81 },
        { puissance: 15, abonnement: 32.30 },
        { puissance: 18, abonnement: 37.87 },
        { puissance: 24, abonnement: 48.74 },
        { puissance: 30, abonnement: 59.82 },
        { puissance: 36, abonnement: 70.89 }
    ].map(item => ({
        ...item,
        hiver: {
            prixKwhHC: 22.900,
            prixKwhHP: 31.040
        },
        hiverWeekend: {
            prixKwhHC: 22.900,
            prixKwhHP: 31.040
        },
        ete: {
            prixKwhHC: 13.715,
            prixKwhHP: 19.367
        },
        eteWeekend: {
            prixKwhHC: 13.715,
            prixKwhHP: 19.367
        }
    })),
    hc: [],
    hcByDayType: {
        hiver: [{
            start: { hour: 0, minute: 0 },
            end: { hour: 7, minute: 0 }
        },
        {
            start: { hour: 13, minute: 0 },
            end: { hour: 16, minute: 0 }
        }],
        ete: [{
            start: { hour: 11, minute: 0 },
            end: { hour: 17, minute: 0 }
        }],
        hiverWeekend: [{
            start: { hour: 0, minute: 0 },
            end: { hour: 24, minute: 0 }
        }],
        eteWeekend: [{
            start: { hour: 0, minute: 0 },
            end: { hour: 24, minute: 0 }
        }]
    },
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    getDayType: function (day, time) {
        let checkDate = day.date;
        if (time.hour < 6) {
            let dateObj = new Date(day.date + " 12:00:00");
            dateObj.setDate(dateObj.getDate() - 1);
            checkDate = dateObj.toISOString().split("T")[0].replace(/-/g, "/");
        }
        const month = checkDate.split("/").map(Number)[1];
        const season = (month >= 11 || month <= 3) ? "hiver" : "ete";
        const dateObj = new Date(checkDate + " 12:00:00");
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday

        return isWeekend ? season + "Weekend" : season;
    }
});