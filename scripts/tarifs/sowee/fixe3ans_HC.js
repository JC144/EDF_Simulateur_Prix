abonnements.push({
    name: "Sowee - Elec Prix Fixe 3 ans - Heures Creuses",
    offer_type: "Marché",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.sowee.fr/tarifs-contrats-energies-gaz-electricite",
    price_url: "https://www.sowee.fr/s3fs-public/Grille_de_prix_Elec_Prix_fixe_3_ans_Fevrier_2024.pdf",
    prices: [
    { puissance: 6, abonnement: 13.39 },
    { puissance: 9, abonnement: 17.00 },
    { puissance: 12, abonnement: 20.52 },
    { puissance: 15, abonnement: 23.89 },
    { puissance: 18, abonnement: 27.22 },
    { puissance: 24, abonnement: 34.21 },
    { puissance: 30, abonnement: 40.60 },
    { puissance: 36, abonnement: 47.04 },
].map(item => ({
    ...item,
    bleu: { prixKwhHP: 23.57, prixKwhHC: 18.13 }
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
