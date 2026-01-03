abonnements.push(
    {
        name: "Gaz de Bordeaux - NovaFlex - base",
        offer_type: "TRV",
        lastUpdate: "2026-01-03",
        isCommunity: true,
        subscription_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-verte-prix-indexe",
        price_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-verte-prix-indexe",
        prices: [
            { puissance: 3, abonnement: 11.72 },
            { puissance: 6, abonnement: 15.46 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.33 },
            { puissance: 15, abonnement: 27.06 },
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 18.726 }
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
        name: "Gaz de Bordeaux - NovaFlex - heures creuses",
        offer_type: "TRV",
        lastUpdate: "2026-01-03",
        isCommunity: true,
        subscription_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-verte-prix-indexe",
        price_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-verte-prix-indexe",
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
            bleu: { prixKwhHP: 19.945, prixKwhHC: 15.716 }
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
