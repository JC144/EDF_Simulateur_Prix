abonnements.push({
    name: "Octopus - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-05-13",
    subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/a47d7d5ed1/grille-tarifaire-eco-conso-fixe-202405.pdf",
    prices: [
        { puissance: 6, abonnement: 13.01 },
        { puissance: 9, abonnement: 16.71 },
        { puissance: 12, abonnement: 20.13 },
        { puissance: 15, abonnement: 23.40 },
        { puissance: 18, abonnement: 26.64 },
        { puissance: 24, abonnement: 33.44 },
        { puissance: 30, abonnement: 39.63 },
        { puissance: 36, abonnement: 44.79 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 21.61, prixKwhHC: 16.68 }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
