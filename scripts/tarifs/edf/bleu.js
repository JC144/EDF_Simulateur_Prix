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
            abonnement: 10.48,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 6,
            abonnement: 13.86,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 9,
            abonnement: 17.48,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 12,
            abonnement: 21.14,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 15,
            abonnement: 24.55,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 18,
            abonnement: 27.81,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 24,
            abonnement: 35.23,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 30,
            abonnement: 42.69,
            bleu: {
                prixKwhHC: 20.16
            }
        },
        {
            puissance: 36,
            abonnement: 49.23,
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

