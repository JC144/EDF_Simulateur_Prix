abonnements.push(
    {
        name: "Alpiq - Base",
        lastUpdate: "2025-02-01",
        isCommunity: false,
        subscription_url: "https://particuliers.alpiq.fr/electricite/nos-tarifs",
        price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
        prices: [
            { puissance: 3, abonnement: 10.41 },
            { puissance: 6, abonnement: 13.72 },
            { puissance: 9, abonnement: 17.27 },
            { puissance: 12, abonnement: 20.86 },
            { puissance: 15, abonnement: 24.2 },
            { puissance: 18, abonnement: 27.39 },
            { puissance: 24, abonnement: 34.68 },
            { puissance: 30, abonnement: 41.99 },
            { puissance: 36, abonnement: 48.39 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 19.5154,  prixKwhHP: 19.5154 }
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

