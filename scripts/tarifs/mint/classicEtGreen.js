abonnements.push(
    {
        name: "Mint Energie - Classic & Green",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14624_CLASSIC_GREEN.pdf",
        prices: [
    { puissance: 3, abonnement: 10.11 },
    { puissance: 6, abonnement: 13.25 },
    { puissance: 9, abonnement: 16.63 },
    { puissance: 12, abonnement: 20.08 },
    { puissance: 15, abonnement: 23.29 },
    { puissance: 18, abonnement: 26.48 },
    { puissance: 24, abonnement: 33.55 },
    { puissance: 30, abonnement: 39.58 },
    { puissance: 36, abonnement: 46.68 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 22.90 }
})),

        hc: [{
            start: { hour: 0, minute: 0 },
            end: { hour: 24, minute: 0 }
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

