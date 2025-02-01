abonnements.push(
    {
        name: "EDF - Bleu",
        offer_type: "TRV",
        lastUpdate: "2025-02-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_Tarif_Bleu.pdf",
        prices: [{
            puissance: 3,
            abonnement: 10.41,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 6,
            abonnement: 13.72,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 9,
            abonnement: 17.27,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 12,
            abonnement: 20.86,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 15,
            abonnement: 24.20,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 18,
            abonnement: 27.39,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 24,
            abonnement: 34.68,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 30,
            abonnement: 41.99,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 36,
            abonnement: 48.39,
            bleu: {
                prixKwhHC: 20.16
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

