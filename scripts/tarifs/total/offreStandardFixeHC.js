abonnements.push(
    {
        name: "TotalEnergie - Offre standard fixe HC",
        lastUpdate: "2024-03-26",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-standard-fixe-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-standard-fixe-particuliers.pdf",
        prices: [
    { puissance: 6, abonnement: 13.00 },
    { puissance: 9, abonnement: 16.54 },
    { puissance: 12, abonnement: 19.97 },
    { puissance: 15, abonnement: 23.21 },
    { puissance: 18, abonnement: 26.41 },
    { puissance: 24, abonnement: 33.22 },
    { puissance: 30, abonnement: 39.27 },
    { puissance: 36, abonnement: 45.40 },
].map(item => ({
    ...item,
    bleu: { prixKwhHP: 22.88, prixKwhHC: 17.51 }
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