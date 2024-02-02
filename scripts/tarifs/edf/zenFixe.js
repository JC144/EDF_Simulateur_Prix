abonnements.push(
    {
        name: "EDF - Zen Fixe",
        offer_type: "TRV",
        lastUpdate: "2024-02-01",
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.47,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 9,
            abonnement: 15.63,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 12,
            abonnement: 18.89,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 15,
            abonnement: 21.92,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 18,
            abonnement: 24.92,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 24,
            abonnement: 31.60,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 30,
            abonnement: 37.28,
            bleu: {
                prixKwhHC: 22.66
            }
        },
        {
            puissance: 36,
            abonnement: 43.99,
            bleu: {
                prixKwhHC: 22.66
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

