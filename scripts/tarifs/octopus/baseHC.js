abonnements.push(
    {
        name: "Octopus - Heures Creuses",
        offer_type: "Marché",
        lastUpdate: "2026-03-19",
        subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
        price_url: "https://a.storyblok.com/f/151412/x/a5a79d71c2/grille-tarifaire-eco_conso_fixe_2_b_mars26.pdf",
        prices: [
            { puissance: 6, abonnement: 15.65 },
            { puissance: 9, abonnement: 19.83 },
            { puissance: 12, abonnement: 23.68 },
            { puissance: 15, abonnement: 27.30 },
            { puissance: 18, abonnement: 31.03 },
            { puissance: 24, abonnement: 38.97 },
            { puissance: 30, abonnement: 46.27 },
            { puissance: 36, abonnement: 52.54 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 15.55,  prixKwhHP: 20.31 }
        })),
        hc: [],
        hasHCCustom: true,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);
