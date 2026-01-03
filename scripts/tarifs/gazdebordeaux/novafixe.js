abonnements.push(
    {
        name: "Gaz de Bordeaux - NovaFixe - base",
        offer_type: "Marché",
        lastUpdate: "2026-01-03",
        isCommunity: true,
        subscription_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        price_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        prices: [
            { puissance: 3, abonnement: 11.72 },
            { puissance: 6, abonnement: 15.46 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.33 },
            { puissance: 15, abonnement: 27.06 },
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 16.337 }
        })),
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

abonnements.push(
    {
        name: "Gaz de Bordeaux - NovaFixe - heures creuses",
        offer_type: "Marché",
        lastUpdate: "2026-01-03",
        isCommunity: true,
        subscription_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        price_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        prices: [
            { puissance: 6, abonnement: 16.01 },
            { puissance: 9, abonnement: 20.21 },
            { puissance: 12, abonnement: 24.28 },
            { puissance: 15, abonnement: 28.16 },
            { puissance: 18, abonnement: 32.14 },
            { puissance: 24, abonnement: 40.52 },
            { puissance: 30, abonnement: 48.34 },
            { puissance: 36, abonnement: 56.20 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHP: 17.364, prixKwhHC: 13.802 }
        })),
        hc: [],
        hasHCCustom: true,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    });
