abonnements.push(
    {
        name: "Mint Energie - Classic & Green HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14624_CLASSIC_GREEN.pdf",
        prices: [
    { puissance: 6, abonnement: 13.95 },
    { puissance: 9, abonnement: 17.70 },
    { puissance: 12, abonnement: 21.37 },
    { puissance: 15, abonnement: 24.87 },
    { puissance: 18, abonnement: 28.34 },
    { puissance: 24, abonnement: 35.61 },
    { puissance: 30, abonnement: 42.25 },
    { puissance: 36, abonnement: 48.93 },
].map(item => ({
    ...item,
    bleu: { prixKwhHP: 24.55, prixKwhHC: 18.86 }
})),

        hc: [{
            start: {hour:22, minute:0},
            end: {hour:24, minute:0}
        },
        {
            start: {hour:0, minute:0},
            end: {hour:6, minute:0}
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

