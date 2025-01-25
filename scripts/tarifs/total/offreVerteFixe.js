abonnements.push(
    {
        name: "TotalEnergie - Offre verte fixe",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Documents-contractuels/GT/grille-tarifaire-verte-fixe-particuliers.pdf",
        prices: [
    { puissance: 3, abonnement: 9.51 },
    { puissance: 6, abonnement: 12.50 },
    { puissance: 9, abonnement: 15.75 },
    { puissance: 12, abonnement: 19.08 },
    { puissance: 15, abonnement: 22.14 },
    { puissance: 18, abonnement: 25.17 },
    { puissance: 24, abonnement: 32.05 },
    { puissance: 30, abonnement: 30.71 },
    { puissance: 36, abonnement: 44.62 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 21.77 }
})),

        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
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

