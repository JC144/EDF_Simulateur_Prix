abonnements.push({
    name: "Octopus - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.octopusenergy.fr/offre-electricite-tarifs",
    price_url: "https://a.storyblok.com/f/151412/x/88a1a21fb7/grille-tarifaire-eco-conso-fixe-202402.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 14.46,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 9,
            abonnement: 18.35,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 12,
            abonnement: 22.13,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 15,
            abonnement: 25.75,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 18,
            abonnement: 29.34,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 24,
            abonnement: 36.86,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 30,
            abonnement: 43.72,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
            }
        },
        {
            puissance: 36,
            abonnement: 50.64,
            bleu: {
                prixKwhHP: 29.33,
                prixKwhHC: 22.40
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
