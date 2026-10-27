// Heures pleines / heures creuses différenciées par saison (hiver
// novembre-mars / été), plages HC du compteur saisies par l'utilisateur.
defineTarif({
    name: "Octopus - Eco-fixe Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-08-12",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/d505811345/grille-tarifaire-ecofixe-aout-26-hphc.pdf",
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
        hiver: { HP: 24.61, HC: 18.09 },
        ete: { HP: 18.76, HC: 14.05 }
    },
    // La grille a trois paliers de prix du kWh : 3 kVA, 6 kVA, 9 à 36 kVA
    // (en été, 3 kVA est au prix de référence)
    priceOverrides: {
        3: { hiver: { HP: 21.95, HC: 16.26 } },
        6: { hiver: { HP: 24.09, HC: 17.73 }, ete: { HP: 17.87, HC: 13.44 } }
    },
    dayRule: {
        type: "season",
        seasons: {
            hiver: { months: [11, 12, 1, 2, 3] },
            ete: { months: [4, 5, 6, 7, 8, 9, 10] }
        }
    },
    hcRanges: "custom"
});
