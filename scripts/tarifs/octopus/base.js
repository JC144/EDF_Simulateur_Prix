abonnements.push(
    {
        name: "Octopus - Base",
        offer_type: "Marché",
        lastUpdate: "2025-08-01",
        subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
        price_url: "https://a.storyblok.com/f/151412/x/cea34c87af/grille-tarifaire-eco_conso_fixe_6_aout25.pdf",
        prices: [
            { puissance: 3, abonnement: 11.73 },
            { puissance: 6, abonnement: 15.47 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 27.06 },
            { puissance: 18, abonnement: 30.76 },
            { puissance: 24, abonnement: 38.79 },
            { puissance: 30, abonnement: 46.44 },
            { puissance: 36, abonnement: 55.05 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 18.56,  prixKwhHP: 18.56 }
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

