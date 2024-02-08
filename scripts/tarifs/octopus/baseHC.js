abonnements.push({
    name: "Octopus - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/88a1a21fb7/grille-tarifaire-eco-conso-fixe-202402.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.01,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 9,
            abonnement: 16.70,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 12,
            abonnement: 20.13,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 15,
            abonnement: 23.40,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 18,
            abonnement: 26.64,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 24,
            abonnement: 33.44,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 30,
            abonnement: 39.63,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        },
        {
            puissance: 36,
            abonnement: 44.79,
            bleu: {
                prixKwhHP: 23.33,
                prixKwhHC: 17.95
            }
        }],
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});
