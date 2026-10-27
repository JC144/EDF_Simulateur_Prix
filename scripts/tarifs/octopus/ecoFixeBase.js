// Prix unique jour/nuit mais différencié par saison (hiver novembre-mars / été).
defineTarif({
    name: "Octopus - Eco-fixe Base",
    offer_type: "Marché",
    lastUpdate: "2026-08-12",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/f9e6edf063/grille-tarifaire-eco-fixe-aout-26-base.pdf",
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
        hiver: { price: 22.77 },
        ete: { price: 17.43 }
    },
    // La grille a trois paliers de prix du kWh : 3 kVA, 6 kVA, 9 à 36 kVA
    priceOverrides: {
        3: { hiver: { price: 20.50 }, ete: { price: 19.19 } },
        6: { hiver: { price: 22.45 }, ete: { price: 17.07 } }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3] },
            ete: { months: [4, 5, 6, 7, 8, 9, 10] }
        }
    }
});
