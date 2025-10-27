abonnements.push(
    {
        name: "Mint Energie - Online & Green HC",
        lastUpdate: "2025-08-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_21912_ONLINE_GREEN.pdf",
        prices: [
            { puissance: 6, abonnement: 16.01 },
            { puissance: 9, abonnement: 20.21 },
            { puissance: 12, abonnement: 24.28 },
            { puissance: 15, abonnement: 28.15 },
            { puissance: 18, abonnement: 32.13 },
            { puissance: 24, abonnement: 40.53 },
            { puissance: 30, abonnement: 48.34 },
            { puissance: 36, abonnement: 56.20 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 14.95,  prixKwhHP: 18.91 }
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

