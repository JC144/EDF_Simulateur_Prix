abonnements.push(
    {
        name: "TotalEnergie - HeuresEco HC",
        lastUpdate: "2025-10-01",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-heures-eco-particuliers.pdf",
        prices: [
            { puissance: 6, abonnement: 15.74 },
            { puissance: 9, abonnement: 20.21 },
            { puissance: 12, abonnement: 24.64 },
            { puissance: 15, abonnement: 28.60 },
            { puissance: 18, abonnement: 32.13 },
            { puissance: 24, abonnement: 40.53 },
            { puissance: 30, abonnement: 48.34 },
            { puissance: 36, abonnement: 56.20 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 16.35,  prixKwhHP: 20.81 }
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

