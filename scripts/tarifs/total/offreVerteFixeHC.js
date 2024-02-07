abonnements.push(
    {
        name: "TotalEnergie - Offre verte fixe HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
        price_url: "https://www.totalenergies.fr/fileadmin/Digital/Documents-contractuels/GT/grille-tarifaire-verte-fixe-particuliers.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 13.00,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 9,
            abonnement: 16.54,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 15,
            abonnement: 23.21,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 18,
            abonnement: 26.41,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 24,
            abonnement: 33.22,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 30,
            abonnement: 39.27,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        },
        {
            puissance: 36,
            abonnement: 45.40,
            bleu: {
                prixKwhHP: 23.34,
                prixKwhHC: 17.96
            }
        }],
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

