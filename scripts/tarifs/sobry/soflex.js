// Sobry SoFlex : fourniture au prix spot EPEX FR Day-Ahead avec plafond
// garanti annuel unique (grille "Particuliers", option SoFlex).
// Prix du kWh par créneau (centimes TTC) :
//   (min(spot + turpe[saison] + accise, cap[saison]) + conformite + marge + prime) * tva
// avec hiver = novembre à mars (saisons TURPE).
// Abonnement TTC/mois = abonnement CU4 TTC publié + CTA sur le TURPE fixe,
// TVA incluse. Le TURPE variable est la moyenne saisonnière publiée par Sobry.
defineTarif({
    name: "Sobry - SoFlex",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://sobry.co/",
    price_url: "https://storage.googleapis.com/sobry-legals/grille-tarifaire-sobry.pdf",
    subscriptions: {
        3: 12.96575,
        6: 21.37465,
        9: 28.05355,
        12: 34.13245,
        15: 39.85135,
        18: 45.35025,
        24: 55.84805,
        30: 65.92585,
        36: 75.70365
    },
    dayRule: { type: "spot", source: "epex-fr" },
    spotFormula: {
        turpe: { hiver: 6.45, ete: 1.53 },
        accise: 3.062,
        cap: { hiver: 70, ete: 70 },
        conformite: 2,
        marge: 0.80,
        prime: 0.20,
        tva: 1.20
    }
});
