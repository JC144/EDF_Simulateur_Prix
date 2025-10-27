abonnements.push(
    {
        name: "Mint Energie - Classic & Green HC",
        lastUpdate: "2025-08-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_23012_CLASSIC_GREEN.pdf",
        prices: [
            { puissance: 6, abonnement: 16.25 },
            { puissance: 9, abonnement: 17.64 },
            { puissance: 12, abonnement: 22.64 },
            { puissance: 15, abonnement: 26.44 },
            { puissance: 18, abonnement: 30.24 },
            { puissance: 24, abonnement: 39.03 },
            { puissance: 30, abonnement: 47.23 },
            { puissance: 36, abonnement: 54.82 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 16.35,  prixKwhHP: 20.81 }
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

