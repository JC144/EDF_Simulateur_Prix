abonnements.push(
    {
        name: "TotalEnergie - Offre standard fixe",
        lastUpdate: "2025-10-24",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-standard-fixe-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-standard-fixe-particuliers.pdf",
        prices: [
            { puissance: 3, abonnement: 13.45 },
            { puissance: 6, abonnement: 17.74 },
            { puissance: 9, abonnement: 22.34 },
            { puissance: 12, abonnement: 27.01 },
            { puissance: 15, abonnement: 31.35 },
            { puissance: 18, abonnement: 35.45 },
            { puissance: 24, abonnement: 44.95 },
            { puissance: 30, abonnement: 54.44 },
            { puissance: 36, abonnement: 62.75 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 18.91,  prixKwhHP: 18.91 }
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