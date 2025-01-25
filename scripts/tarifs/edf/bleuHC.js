abonnements.push({
    name: "EDF - Bleu Heures Creuses",
    offer_type: "TRV",
    lastUpdate: "2024-11-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_Tarif_Bleu.pdf",
    prices: [
        { puissance: 6, abonnement: 13.09 },
        { puissance: 9, abonnement: 16.70 },
        { puissance: 12, abonnement: 20.28 },
        { puissance: 15, abonnement: 23.57 },
        { puissance: 18, abonnement: 26.84 },
        { puissance: 24, abonnement: 33.70 },
        { puissance: 30, abonnement: 38.97 },
        { puissance: 36, abonnement: 45.08 }
    ].map(item => ({
        ...item,
        bleu: { prixKwhHP: 27.00, prixKwhHC: 20.68 }
    })),
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        return "bleu";
    }
});
