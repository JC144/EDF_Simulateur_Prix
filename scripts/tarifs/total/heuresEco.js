abonnements.push(
    {
        name: "TotalEnergie - Heures Eco",
        lastUpdate: "2025-10-01",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-heures-eco-particuliers.pdf",
        prices: [
            { puissance: 3, abonnement: 11.73 },
            { puissance: 6, abonnement: 15.47 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 27.06 },
            { puissance: 18, abonnement: 31.14 },
            { puissance: 24, abonnement: 39.29 },
            { puissance: 30, abonnement: 47.07 },
            { puissance: 36, abonnement: 55.05 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 19.52,  prixKwhHP: 19.52 }
        })),
        hc: [{
            start: { hour: 0, minute: 0 },
            end: { hour: 24, minute: 0 }
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

