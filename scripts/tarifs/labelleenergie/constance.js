abonnements.push(
    {
        name: "La Belle Energie - Constance",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
    { puissance: 3, abonnement: 11.68 },
    { puissance: 6, abonnement: 14.71 },
    { puissance: 9, abonnement: 17.95 },
    { puissance: 12, abonnement: 21.26 },
    { puissance: 15, abonnement: 24.35 },
    { puissance: 18, abonnement: 27.41 },
    { puissance: 24, abonnement: 34.20 },
    { puissance: 30, abonnement: 39.99 },
    { puissance: 36, abonnement: 46.81 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 20.64 }
})),

        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

