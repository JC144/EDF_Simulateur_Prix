abonnements.push({
    name: "EDF - Vert Electrique Régional",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        {
            puissance: 6, abonnement: 12.80,
            bleu: {
                prixKwhHC: 26.36
            }
        },
        {
            puissance: 9, abonnement: 16.05,
            bleu: {
                prixKwhHC: 26.40
            }
        },
        {
            puissance: 12, abonnement: 19.37,
            bleu: {
                prixKwhHC: 26.40
            }
        },
        {
            puissance: 15, abonnement: 22.46,
            bleu: {
                prixKwhHC: 26.40
            }
        },
        {
            puissance: 18, abonnement: 25.54,
            bleu: {
                prixKwhHC: 26.40
            }
        },
        {
            puissance: 24, abonnement: 32.34,
            bleu: {
                prixKwhHC: 26.40
            }
        },
        {
            puissance: 30, abonnement: 38.14,
            bleu: {
                prixKwhHC: 26.40
            }
        },
        {
            puissance: 36, abonnement: 46.23,
            bleu: {
                prixKwhHC: 26.40
            }
        }
    ].map(item => ({
        ...item,

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
});

abonnements.push({
    name: "EDF - Vert Electrique Régional Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2025-02-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-verte/vert-electrique-regional.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-vert-electrique-regional.pdf",
    prices: [
        { puissance: 6, abonnement: 13.21 },
        { puissance: 9, abonnement: 17.01 },
        { puissance: 12, abonnement: 20.51 },
        { puissance: 15, abonnement: 23.86 },
        { puissance: 18, abonnement: 26.55 },
        { puissance: 24, abonnement: 33.30 },
        { puissance: 30, abonnement: 39.43 },
        { puissance: 36, abonnement: 45.62 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 29.22,
            prixKwhHC: 20.56
        }
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