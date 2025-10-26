abonnements.push(
    {
        name: "TotalEnergie - Offre verte fixe HC",
        lastUpdate: "2025-10-24",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Documents-contractuels/GT/grille-tarifaire-verte-fixe-particuliers.pdf",
        prices: [
            { puissance: 6, abonnement: 18.47 },
            { puissance: 9, abonnement: 23.39 },
            { puissance: 12, abonnement: 28.17 },
            { puissance: 15, abonnement: 32.14 },
            { puissance: 18, abonnement: 37.38 },
            { puissance: 24, abonnement: 47.15 },
            { puissance: 30, abonnement: 56.00 },
            { puissance: 36, abonnement: 65.08 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 16.06,  prixKwhHP: 20.40 }
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

