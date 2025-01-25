abonnements.push(
    {
        name: "TotalEnergie - HeuresEco HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-heures-eco-particuliers.pdf",
        prices: [
    { puissance: 6, abonnement: 12.85 },
    { puissance: 9, abonnement: 16.55 },
    { puissance: 12, abonnement: 20.36 },
    { puissance: 15, abonnement: 23.73 },
    { puissance: 18, abonnement: 26.48 },
    { puissance: 24, abonnement: 33.28 },
    { puissance: 30, abonnement: 39.46 },
    { puissance: 36, abonnement: 44.63 },
].map(item => ({
    ...item,
    bleu: { prixKwhHP: 27.95, prixKwhHC: 19.27 }
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

