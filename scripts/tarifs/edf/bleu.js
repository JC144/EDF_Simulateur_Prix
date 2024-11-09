abonnements.push(
    {
        name: "EDF - Bleu",
        offer_type: "TRV",
        lastUpdate: "2024-11-01",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_Tarif_Bleu.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 6,
            abonnement: 12.68,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 9,
            abonnement: 15.89,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 12,
            abonnement: 19.16,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 15,
            abonnement: 22.07,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 18,
            abonnement: 25.24,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 24,
            abonnement: 31.96,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 30,
            abonnement: 37.68,
            bleu: {
                prixKwhHC: 25.16
            }
        },
        {
            puissance: 36,
            abonnement: 44.43,
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

