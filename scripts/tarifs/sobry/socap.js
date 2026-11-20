// Sobry SoCap : fourniture au prix spot EPEX FR Day-Ahead avec plafond
// garanti saisonnier (grille "Particuliers", option SoCap).
// Prix du kWh par créneau (centimes TTC) :
//   (min(spot + turpe[saison] + accise, cap[saison]) + conformite + marge + prime) * tva
// avec hiver = novembre à mars (saisons TURPE).
// Abonnement TTC/mois = (Total_CU4_HTVA + 15 % × Acheminement_HTVA) × 1,20
// Offre fermée à la souscription. Les clients retrouvent leurs prix dans
// leur espace Sobry. La dernière grille publique connue est conservée ici.
defineTarif({
    name: "Sobry - SoCap",
    offer_type: "Marché",
    lastUpdate: "2026-06-17",
    isCommunity: true,
    subscription_url: "",
    price_url: "https://app.sobry.co/",
    pricesInCustomerArea: true,
    subscriptions: {
        3: 12.7488,
        6: 21.0402,
        9: 27.6276,
        12: 33.5892,
        15: 39.2046,
        18: 44.592,
        24: 54.873,
        30: 64.7358,
        36: 74.3088
    },
    dayRule: { type: "spot", source: "epex-fr" },
    spotFormula: {
        turpe: { hiver: 6.32, ete: 1.49 },
        accise: 3.085,
        cap: { hiver: 25.00, ete: 14.17 },
        conformite: 1.00,
        marge: 0.80,
        prime: 0.70,
        tva: 1.20
    }
});
