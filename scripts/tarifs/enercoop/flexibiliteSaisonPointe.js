defineTarif({
    name: "Enercoop - Flexibilité 2 saisons - Jours de pointe",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://souscription.enercoop.fr/",
    price_url: "https://www.faq.enercoop.fr/hc/fr/article_attachments/37607556170770",
    subscriptions: {
        1: 6.29, 2: 8.01, 3: 9.73, 4: 11.47, 5: 13.19, 6: 14.91,
        7: 16.58, 8: 18.30, 9: 20.01, 10: 21.73, 11: 23.44, 12: 25.16,
        13: 26.85, 14: 28.56, 15: 30.28, 16: 31.99, 17: 33.70, 18: 35.42,
        19: 37.13, 20: 38.84, 21: 40.56, 22: 42.27, 23: 43.98, 24: 45.74,
        25: 47.46, 26: 49.17, 27: 50.89, 28: 52.61, 29: 54.32, 30: 56.04,
        31: 57.75, 32: 59.47, 33: 61.18, 34: 62.90, 35: 64.61, 36: 66.33
    },
    dayTypes: {
        hiver: { HP: 29.011, HC: 21.613 },
        hiverWeekend: { HP: 21.613, HC: 21.613 },
        hiverPointe: { HP: 53.744, HC: 21.613 },
        ete: { HP: 19.576, HC: 13.764 },
        eteWeekend: { HP: 13.764, HC: 13.764 },
        etePointe: { HP: 53.744, HC: 13.764 }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3], weekendType: "hiverWeekend", peakType: "hiverPointe" },
            ete: { months: [4, 5, 6, 7, 8, 9, 10], weekendType: "eteWeekend", peakType: "etePointe" }
        },
        weekendDays: [0, 6],
        includePublicHolidays: true
    },
    hcRanges: {
        byDayType: {
            hiver: [{ from: "00:00", to: "07:00" }, { from: "13:00", to: "16:00" }],
            hiverPointe: [{ from: "00:00", to: "07:00" }, { from: "13:00", to: "16:00" }],
            ete: [{ from: "11:00", to: "17:00" }],
            etePointe: [{ from: "11:00", to: "17:00" }],
            hiverWeekend: [{ from: "00:00", to: "24:00" }],
            eteWeekend: [{ from: "00:00", to: "24:00" }]
        }
    }
});
