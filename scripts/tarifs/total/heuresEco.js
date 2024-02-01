abonnements.push(
    {
        name: "TotalEnergie - Heures Eco",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-heures-eco-particuliers.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.47,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 9,
            abonnement: 15.63,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 12,
            abonnement: 18.89,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 15,
            abonnement: 21.92,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 18,
            abonnement: 25.25,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 24,
            abonnement: 32.05,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 30,
            abonnement: 37.84,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 36,
            abonnement: 44.66,
            bleu: {
                prixKwhHC: 25.16
            }
        }],
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

