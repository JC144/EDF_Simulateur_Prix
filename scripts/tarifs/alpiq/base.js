abonnements.push(
    {
        name: "Alpiq - Base",
        lastUpdate: "2024-02-01",
        subscription_url: "https://particuliers.alpiq.fr/electricite/nos-tarifs",
        price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.63,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 6,
            abonnement: 12.60,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 9,
            abonnement: 15.79,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 12,
            abonnement: 19.04,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 15,
            abonnement: 22.07,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 18,
            abonnement: 25.08,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 24,
            abonnement: 31.76,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 30,
            abonnement: 37.44,
            bleu: {
                prixKwhHC: 21.7674
            }
        },
        {
            puissance: 36,
            abonnement: 44.81,
            bleu: {
                prixKwhHC: 21.7674
            }
        }],
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
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

