// Ex-OctoTempo (la grille OctoSaisons titre encore sa page HTT « option
// tarifaire OctoTempo ») : tarif saisonnier (hiver novembre-mars / été) avec
// surcharge des jours rouges du calendrier Tempo officiel (partagé avec
// EDF - Tempo via tarifs-lib/calendars/tempo-edf.js).
defineTarif({
    name: "Octopus - OctoSaisons",
    offer_type: "Marché",
    lastUpdate: "2026-10-21",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/octosaisons-gp",
    price_url: "https://a.storyblok.com/f/151412/x/0d23dec94c/grille-tarifaire-octosaisons.pdf",
    subscriptions: {
        3: 12.13,
        6: 15.86,
        9: 19.88,
        12: 23.76,
        15: 27.40,
        18: 31.14,
        24: 39.14,
        30: 46.47,
        36: 53.88
    },
    dayTypes: {
        rouge: { HP: 64.65, HC: 16.15 },
        hiver: { HP: 19.21, HC: 16.15 },
        ete: { HP: 16.15, HC: 13.56 }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3] },
            ete: { months: [4, 5, 6, 7, 8, 9, 10] }
        },
        previousDayBefore: 6,
        calendarOverride: { calendar: "tempo-edf", types: ["rouge"] }
    },
    hcRanges: {
        byDayType: {
            rouge: [{ from: "21:00", to: "24:00" }, { from: "00:00", to: "07:00" }],
            hiver: [{ from: "21:00", to: "24:00" }, { from: "00:00", to: "07:00" }],
            ete: [{ from: "21:00", to: "24:00" }, { from: "00:00", to: "07:00" }, { from: "11:00", to: "17:00" }]
        }
    }
});
