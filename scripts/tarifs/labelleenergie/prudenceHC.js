abonnements.push(
    {
        name: "La Belle Energie - Prudence HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
        price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
        prices: [
    { puissance: 6, abonnement: 12.83 },
    { puissance: 9, abonnement: 16.53 },
    { puissance: 12, abonnement: 19.95 },
    { puissance: 15, abonnement: 23.22 },
    { puissance: 18, abonnement: 26.46 },
    { puissance: 24, abonnement: 33.26 },
    { puissance: 30, abonnement: 39.45 },
    { puissance: 36, abonnement: 45.70 },
].map(item => ({
    ...item,
    bleu: { prixKwhHP: 20.10, prixKwhHC: 15.55 }
})),

        hc: [{
            start: {hour:22, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:6, minute:0}
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

