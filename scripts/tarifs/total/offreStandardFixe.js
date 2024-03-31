abonnements.push(
    {
        name: "TotalEnergie - Offre standard fixe",
        lastUpdate: "2024-03-26",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-standard-fixe-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-standard-fixe-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.51,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 6,
            abonnement: 12.50,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 9,
            abonnement: 15.75,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 12,
            abonnement: 19.08,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 15,
            abonnement: 22.14,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 18,
            abonnement: 25.17,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 24,
            abonnement: 32.05,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 30,
            abonnement: 37.71,
            bleu: {
                prixKwhHC: 21.32
            }
        },
        {
            puissance: 36,
            abonnement: 44.62,
            bleu: {
                prixKwhHC: 21.32
            }
        }],
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