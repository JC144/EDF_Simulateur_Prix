// Heures pleines / heures creuses différenciées par saison (hiver
// novembre-mars / été), plages HC du compteur saisies par l'utilisateur.
defineTarif({
    name: "Octopus - Eco-fixe Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2026-11-16",
    isCommunity: true,
    subscription_url: "https://octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/82c5f363e2/grille-tarifaire-cocon_saisonnalise_hphc_nov26_b.pdf",
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
        hiver: { HP: 24.97, HC: 18.34 },
        ete: { HP: 19.3, HC: 14.43 }
    },
    // Les puissances de 3 et 6 kVA ont leurs propres prix saisonniers.
    priceOverrides: {
        3: { hiver: { HP: 22.31, HC: 16.5 }, ete: { HP: 21.06, HC: 15.65 } },
        6: { hiver: { HP: 22.31, HC: 16.5 }, ete: { HP: 21.06, HC: 15.65 } }
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
