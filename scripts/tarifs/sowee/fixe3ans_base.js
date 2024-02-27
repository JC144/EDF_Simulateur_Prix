abonnements.push(
    {
        name: "Sowee - Elec'Optim",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.sowee.fr/tarifs-contrats-energies-gaz-electricite",
        price_url: "ihttps://www.sowee.fr/s3fs-public/Grille_de_prix_Elec_Optim_Fevrier_2024.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 6,
            abonnement: 12.72,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 9,
            abonnement: 15.96,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 12,
            abonnement: 19.27,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 15,
            abonnement: 22.36,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 18,
            abonnement: 25.42,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 24,
            abonnement: 32.20,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 30,
            abonnement: 38.01,
            bleu: {
                prixKwhHC: 21.77
            }
        },
        {
            puissance: 36,
            abonnement: 44.82,
            bleu: {
                prixKwhHC: 21.77
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

