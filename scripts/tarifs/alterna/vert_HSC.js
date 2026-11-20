// Offre « véhicule électrique » : heures pleines 7-11h et 18-23h toute
// l'année ; le reste dépend de la saison — en été (avril-octobre) les heures
// super creuses sont en pleine journée (11-18h, production solaire) et la
// nuit est en creuses ; en hiver (novembre-mars) c'est l'inverse, les super
// creuses sont la nuit (23h-7h) et 11-18h sont des creuses normales. Tout est
// facturé au prix du type de jour (pas de distinction HP/HC dans les plages).
defineTarif({
    name: "Alterna - Heures Super Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-09-01",
    isCommunity: true,
    subscription_url: "https://www.alterna-energie.fr",
    price_url: "https://www.alterna-energie.fr/tarifs-electricite-vehicule-electrique",
    subscriptions: {
        3: 13.93,
        6: 17.66,
        9: 22.56,
        12: 26.53,
        15: 30.26,
        18: 34.1,
        24: 42.28,
        30: 49.8,
        36: 57.39
    },
    dayTypes: {
        hpEte: { price: 19.85 },
        hscEte: { price: 15 },
        hcEte: { price: 18.23 },
        hpHiver: { price: 22.28 },
        hscHiver: { price: 17.91 },
        hcHiver: { price: 20.66 }
    },
    dayRule: {
        type: "season",
        // Le type par défaut de chaque saison couvre la nuit (23h-7h).
        seasons: {
            hcEte: { months: [4, 5, 6, 7, 8, 9, 10] },
            hscHiver: { months: [11, 12, 1, 2, 3] }
        },
        hourSubTypes: {
            hcEte: [
                { fromHour: 7, toHour: 11, dayType: "hpEte" },
                { fromHour: 11, toHour: 18, dayType: "hscEte" },
                { fromHour: 18, toHour: 23, dayType: "hpEte" }
            ],
            hscHiver: [
                { fromHour: 7, toHour: 11, dayType: "hpHiver" },
                { fromHour: 11, toHour: 18, dayType: "hcHiver" },
                { fromHour: 18, toHour: 23, dayType: "hpHiver" }
            ]
        }
    }
});
