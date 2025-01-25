abonnements.push({
    name: "Sowee - Elec'Optim Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.sowee.fr/tarifs-contrats-energies-gaz-electricite",
    price_url: "https://www.sowee.fr/s3fs-public/Grille_de_prix_Elec_Optim_Fevrier_2024.pdf",
    prices: [
    { puissance: 6, abonnement: 14.46 },
    { puissance: 9, abonnement: 18.35 },
    { puissance: 12, abonnement: 22.13 },
    { puissance: 15, abonnement: 25.75 },
    { puissance: 18, abonnement: 29.34 },
    { puissance: 24, abonnement: 36.86 },
    { puissance: 30, abonnement: 43.72 },
    { puissance: 36, abonnement: 50.64 },
].map(item => ({
    ...item,
    bleu: { prixKwhHP: 29.33, prixKwhHC: 22.40 }
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
