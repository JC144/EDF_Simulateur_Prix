abonnements.push(
    {
        name: "Octopus - Base",
        offer_type: "Marché",
        lastUpdate: "2026-03-19",
        subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
        price_url: "https://a.storyblok.com/f/151412/x/a5a79d71c2/grille-tarifaire-eco_conso_fixe_2_b_mars26.pdf",
        prices: [
            { puissance: 3, abonnement: 12.03 },
            { puissance: 6, abonnement: 15.65 },
            { puissance: 9, abonnement: 19.56 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 26.84 },
            { puissance: 18, abonnement: 30.49 },
            { puissance: 24, abonnement: 38.24 },
            { puissance: 30, abonnement: 45.37 },
            { puissance: 36, abonnement: 53.06 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 18.95,  prixKwhHP: 18.95 }
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

