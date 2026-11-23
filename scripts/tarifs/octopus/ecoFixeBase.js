// Prix unique jour/nuit mais différencié par saison (hiver novembre-mars / été).
defineTarif({
    name: "Octopus - Eco-fixe Base",
    offer_type: "Marché",
    lastUpdate: "2026-11-16",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/e7ba241463/grille-tarifaire-cocon_saisonnalise_base_nov26_b.pdf",
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
        hiver: { price: 23.09 },
        ete: { price: 17.91 }
    },
    // La grille a trois paliers de prix du kWh : 3 kVA, 6 kVA, 9 à 36 kVA
    priceOverrides: {
        3: { hiver: { price: 20.82 }, ete: { price: 19.68 } },
        6: { hiver: { price: 22.78 }, ete: { price: 17.56 } }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3] },
            ete: { months: [4, 5, 6, 7, 8, 9, 10] }
        }
    }
});
