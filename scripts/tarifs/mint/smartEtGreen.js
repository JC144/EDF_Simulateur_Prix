abonnements.push(
    {
        name: "Mint Energie - Smart & Green",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14712_SMART_GREEN.pdf",
        prices: [
    { puissance: 3, abonnement: 9.69 },
    { puissance: 6, abonnement: 12.71 },
    { puissance: 9, abonnement: 15.96 },
    { puissance: 12, abonnement: 19.26 },
    { puissance: 15, abonnement: 22.35 },
    { puissance: 18, abonnement: 25.42 },
    { puissance: 24, abonnement: 32.20 },
    { puissance: 30, abonnement: 38.00 },
    { puissance: 36, abonnement: 44.81 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 25.16 }
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

