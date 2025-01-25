abonnements.push(
    {
        name: "Sowee - Elec'Optim",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.sowee.fr/tarifs-contrats-energies-gaz-electricite",
        price_url: "https://www.sowee.fr/s3fs-public/Grille_de_prix_Elec_Optim_Fevrier_2024.pdf",
        prices: [
    { puissance: 3, abonnement: 10.15 },
    { puissance: 6, abonnement: 13.32 },
    { puissance: 9, abonnement: 16.71 },
    { puissance: 12, abonnement: 20.17 },
    { puissance: 15, abonnement: 23.39 },
    { puissance: 18, abonnement: 26.59 },
    { puissance: 24, abonnement: 33.68 },
    { puissance: 30, abonnement: 39.75 },
    { puissance: 36, abonnement: 46.87 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 26.41 }
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
    }
);

