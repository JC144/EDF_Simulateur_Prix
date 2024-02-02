abonnements.push(
    {
        name: "ES - Bleu Heures Creuses",
        offer_type: "TRV",
        lastUpdate: "2024-02-01",
        subscription_url: "https://particuliers.es.fr/Offres-energies-services/Electricite-Gaz/Les-offres-electricite-d-ES/Tarif-Reglemente-electricite",
        price_url: "https://particuliers.es.fr/Media/Files/Part/Documentation-electricite/Tarif-reglemente-Fiche-descriptive-de-l-offre",
        prices: [
            {
                puissance: 6,
                abonnement: 13.39,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 9,
                abonnement: 17.00,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 12,
                abonnement: 20.52,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 15,
                abonnement: 23.89,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 18,
                abonnement: 27.22,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 24,
                abonnement: 34.22,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 30,
                abonnement: 40.60,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            },
            {
                puissance: 36,
                abonnement: 47.04,
                bleu: {
                    prixKwhHP: 27.00,
                    prixKwhHC: 20.676
                }
            }],
        hc: [{
            start: {hour:23, minute:0},
            end: {hour:7, minute:0}
        }],
        hasHCCustom: true,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    });
