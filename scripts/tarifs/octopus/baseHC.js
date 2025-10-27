abonnements.push({
    name: "Octopus - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-08-01",
    subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/cea34c87af/grille-tarifaire-eco_conso_fixe_6_aout25.pdf",
    prices: [
            { puissance: 6, abonnement: 15.74 },
            { puissance: 9, abonnement: 20.21 },
            { puissance: 12, abonnement: 24.28 },
            { puissance: 15, abonnement: 28.15 },
            { puissance: 18, abonnement: 32.13 },
            { puissance: 24, abonnement: 40.53 },
            { puissance: 30, abonnement: 48.34 },
            { puissance: 36, abonnement: 54.61 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHC: 15.59,  prixKwhHP: 19.77 }
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
