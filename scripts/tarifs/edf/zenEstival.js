// Tarif saisonnier : hiver (novembre à mars) / été (avril à octobre), avec
// heures super creuses (SC) sur des plages horaires différentes selon la saison.
// Les types hiverSC/eteSC n'ont qu'un prix HC : leurs plages HC couvrent
// l'intégralité de leurs heures.
defineTarif({
    name: "EDF - Zen Estival",
    offer_type: "Marché",
    lastUpdate: "2026-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-estival.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-estival.pdf",
    subscriptions: { 3: 12.13, 6: 15.86, 9: 19.88, 12: 23.76, 15: 27.4, 18: 31.14, 24: 39.14, 30: 46.47, 36: 53.88 },
    dayTypes: {
        hiver: { HP: 27.22, HC: 21.31 },
        hiverSC: { price: 19.92 },
        ete: { HP: 15.88, HC: 14.05 },
        eteSC: { price: 9.91 }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3] },
            ete: { months: [4, 5, 6, 7, 8, 9, 10] }
        },
        previousDayBefore: 6,   // avant 6h, la saison est celle de la veille
        hourSubTypes: {
            ete: [{ fromHour: 11, toHour: 18, dayType: "eteSC" }],
            hiver: [
                { fromHour: 22, toHour: 24, dayType: "hiverSC" },
                { fromHour: 0, toHour: 7, dayType: "hiverSC" }
            ]
        }
    },
    hcRanges: {
        byDayType: {
            hiver: [{ from: "11:00", to: "18:00" }],
            hiverSC: [
                { from: "22:00", to: "24:00" },
                { from: "00:00", to: "07:00" }
            ],
            ete: [
                // Plage historique inerte (fin à 00:00 : jamais atteinte par le
                // calculateur), conservée à l'identique pour l'iso-comportement.
                { from: "22:00", to: "00:00" },
                { from: "00:00", to: "07:00" }
            ],
            eteSC: [{ from: "11:00", to: "18:00" }]
        }
    }
});
