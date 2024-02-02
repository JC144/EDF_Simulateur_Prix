abonnements.push(
    {
        name: "ES - Bleu",
        offer_type: "TRV",
        lastUpdate: "2024-02-01",
        subscription_url: "https://particuliers.es.fr/Offres-energies-services/Electricite-Gaz/Les-offres-electricite-d-ES/Tarif-Reglemente-electricite",
        price_url: "https://particuliers.es.fr/Media/Files/Part/Documentation-electricite/Tarif-reglemente-Fiche-descriptive-de-l-offre",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 6,
            abonnement: 12.71,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 9,
            abonnement: 15.96,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 12,
            abonnement: 19.27,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 15,
            abonnement: 22.35,
            bleu: {
                prixKwhHC: 25.164
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

