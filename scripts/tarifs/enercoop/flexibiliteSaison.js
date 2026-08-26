defineTarif({
    name: "Enercoop - Offre Flexibilité 2 Saisons",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: false,
    subscription_url: "https://www.faq.enercoop.fr/hc/fr",
    price_url: "https://www.faq.enercoop.fr/hc/fr/article_attachments/34072541524114",
    subscriptions: {
        1: 6.40,
        2: 8.23,
        3: 10.05,
        4: 12.07,
        5: 13.94,
        6: 15.82,
        7: 17.43,
        8: 19.26,
        9: 21.10,
        10: 22.93,
        11: 24.77,
        12: 26.60,
        13: 28.36,
        14: 30.19,
        15: 32.02,
        16: 33.85,
        17: 35.68,
        18: 37.51,
        19: 39.34,
        20: 41.17,
        21: 43.00,
        22: 44.83,
        23: 46.66,
        24: 48.22,
        25: 50.04,
        26: 51.86,
        27: 53.68,
        28: 55.50,
        29: 57.32,
        30: 59.14,
        31: 60.95,
        32: 62.77,
        33: 64.59,
        34: 66.41,
        35: 68.23,
        36: 70.05
    },
    dayTypes: {
        hiver: { HP: 31.601, HC: 22.356 },
        hiverWeekend: { HP: 31.601, HC: 22.356 },
        ete: { HP: 19.567, HC: 13.831 },
        eteWeekend: { HP: 19.567, HC: 13.831 }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3], weekendType: "hiverWeekend" },
            ete: { months: [4, 5, 6, 7, 8, 9, 10], weekendType: "eteWeekend" }
        },
        weekendDays: [0, 6],
        previousDayBefore: 6
    },
    // Le week-end, toute la journée est facturée en heures creuses.
    hcRanges: {
        byDayType: {
            hiver: [{ from: "00:00", to: "07:00" }, { from: "13:00", to: "16:00" }],
            ete: [{ from: "11:00", to: "17:00" }],
            hiverWeekend: [{ from: "00:00", to: "24:00" }],
            eteWeekend: [{ from: "00:00", to: "24:00" }]
        }
    }
});
