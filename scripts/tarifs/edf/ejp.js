// Les jours de pointe viennent du calendrier partagé
// scripts/tarifs-lib/calendars/ejp-edf.js (chargé avant ce fichier).
// Contrairement à Tempo, EJP n'a pas de report « avant 6h = veille ».
defineTarif({
    name: "EDF - EJP",
    offer_type: "TRV",
    lastUpdate: "2026-08-01",
    isCommunity: false,
    subscriptionRule: { kind: "closed", reason: "Option EJP en extinction" },
    subscription_url: "",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_EJP.pdf",
    subscriptions: { 9: 19.52, 12: 23.14, 15: 26.81, 18: 30.37, 36: 52.6 },
    dayTypes: {
        bleu: { HP: 17.89, HC: 17.89 },
        rouge: { HP: 43.24, HC: 17.89 }
    },
    dayRule: { type: "calendar", default: "bleu", calendar: "ejp-edf" },
    hcRanges: [{ from: "01:00", to: "07:00" }]
});
