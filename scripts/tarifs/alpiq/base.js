abonnements.push(
    {
        name: "Alpiq - Base",
        lastUpdate: "2025-10-24",
        isCommunity: true,
        subscription_url: "https://particuliers.alpiq.fr/electricite/nos-tarifs",
        price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
        prices: [
            { puissance: 3, abonnement: 11.73 },
            { puissance: 6, abonnement: 15.47 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 27.06 },
            { puissance: 18, abonnement: 30.76 },
            { puissance: 24, abonnement: 38.79 },
            { puissance: 30, abonnement: 46.44 },
            { puissance: 36, abonnement: 54.29 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 17.9292,  prixKwhHP: 17.9292 }
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

    abonnements.push(
        {
            name: "Alpiq - Heures Creuses",
            lastUpdate: "2025-10-24",
            isCommunity: true,
            subscription_url: "https://particuliers.alpiq.fr/electricite/nos-tarifs",
            price_url: "https://particuliers.alpiq.fr/grille-tarifaire/particuliers/gtr_elec_part.pdf",
            prices: [
                { puissance: 6, abonnement: 15.74 },
                { puissance: 9, abonnement: 19.81 },
                { puissance: 12, abonnement: 23.76 },
                { puissance: 15, abonnement: 27.49 },
                { puissance: 18, abonnement: 31.34 },
                { puissance: 24, abonnement: 39.47 },
                { puissance: 30, abonnement: 47.02 },
                { puissance: 36, abonnement: 54.61 }
            ].map(item => ({
                ...item,
                bleu: { prixKwhHP: 19.0848, prixKwhHC: 15.0780 }
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