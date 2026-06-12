abonnements.push(
    {
        name: "Sobry - SoFlex",
        offer_type: "Marché",
        lastUpdate: "2026-04-14",
        subscription_url: "https://sobry.co",
        price_url: "https://storage.googleapis.com/sobry-legals/grille-tarifaire-sobry.pdf",
        prices: sobryPricing.ABO_CU4.map(item => ({
            puissance: item.puissance,
            abonnement: Math.round((item.total + 0.15 * item.acheminement) * 1.20 * 100) / 100,
            bleu: { prixKwhHC: 0, prixKwhHP: 0 }
        })),
        hc: [],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function () {
            return "bleu";
        },
        getPrixKwh: sobryPricing.makeGetPrixKwh("soflex")
    }
);
