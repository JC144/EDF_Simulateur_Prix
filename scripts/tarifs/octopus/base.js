abonnements.push(
    {
        name: "Octopus - Base",
        offer_type: "Marché",
        lastUpdate: "2024-05-13",
        subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
        price_url: "https://a.storyblok.com/f/151412/x/a47d7d5ed1/grille-tarifaire-eco-conso-fixe-202405.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.63,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 6,
            abonnement: 12.60,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 9,
            abonnement: 15.79,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 12,
            abonnement: 19.04,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 15,
            abonnement: 22.08,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 18,
            abonnement: 25.09,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 24,
            abonnement: 31.76,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 30,
            abonnement: 37.44,
            bleu: {
                prixKwhHC: 20.18
            }
        },
        {
            puissance: 36,
            abonnement: 44.82,
            bleu: {
                prixKwhHC: 20.18
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

