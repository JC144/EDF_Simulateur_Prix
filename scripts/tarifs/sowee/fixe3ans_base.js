abonnements.push(
    {
        name: "Sowee - Elec'Prix Fixe 3 ans",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.sowee.fr/tarifs-contrats-energies-gaz-electricite",
        price_url: "https://www.sowee.fr/s3fs-public/Grille_de_prix_Elec_Prix_fixe_3_ans_Fevrier_2024.pdf",
        prices: [
    { puissance: 3, abonnement: 9.69 },
    { puissance: 6, abonnement: 12.72 },
    { puissance: 9, abonnement: 15.96 },
    { puissance: 12, abonnement: 19.27 },
    { puissance: 15, abonnement: 22.36 },
    { puissance: 18, abonnement: 25.42 },
    { puissance: 24, abonnement: 32.20 },
    { puissance: 30, abonnement: 38.01 },
    { puissance: 36, abonnement: 44.82 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 21.77 }
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

