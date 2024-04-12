abonnements.push(
    {
        name: "EDF - Vert Electrique",
        offer_type: "TRV",
        lastUpdate: "2024-03-19",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.63,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 6,
            abonnement: 12.60,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 9,
            abonnement: 15.79,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 12,
            abonnement: 19.04,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 15,
            abonnement: 22.08,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 18,
            abonnement: 25.09,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 24,
            abonnement: 31.76,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 30,
            abonnement: 37.44,
            bleu: {
                prixKwhHC: 24.23
            }
        },
        {
            puissance: 36,
            abonnement: 44.15,
            bleu: {
                prixKwhHC: 24.23
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

