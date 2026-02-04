abonnements.push(
    {
        name: "Gaz de Bordeaux - NovaFixe - base",
        offer_type: "Marché",
        lastUpdate: "2026-02-04",
        isCommunity: true,
        subscription_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        price_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        prices: [
            { puissance: 3, abonnement: 12.02 },
            { puissance: 6, abonnement: 15.65 },
            { puissance: 9, abonnement: 19.56 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 26.85 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: item.puissance <= 6 ? 16.573 : 16.464 }
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
        lastUpdate: "2026-02-04",
        isCommunity: true,
        subscription_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        price_url: "https://www.gazdebordeaux.fr/nos-offres-d-energie/electricite/offre-electricite-prix-fixe-2-ans",
        prices: [
            { puissance: 6, abonnement: 15.83 },
            { puissance: 9, abonnement: 19.84 },
            { puissance: 12, abonnement: 23.68 },
            { puissance: 15, abonnement: 27.30 },
            { puissance: 18, abonnement: 31.03 },
            { puissance: 24, abonnement: 38.96 },
            { puissance: 30, abonnement: 46.28 },
            { puissance: 36, abonnement: 53.63 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHP: 17.596, prixKwhHC: 13.610 }
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
