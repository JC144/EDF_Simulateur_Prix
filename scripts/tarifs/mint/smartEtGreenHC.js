abonnements.push(
    {
        name: "Mint Energie - Smart & Green HC",
        lastUpdate: "2025-10-24",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_21912_ONLINE_GREEN.pdf",
        prices: [
            { puissance: 6, abonnement: 17.45 },
            { puissance: 9, abonnement: 18.84 },
            { puissance: 12, abonnement: 23.84 },
            { puissance: 15, abonnement: 27.64 },
            { puissance: 18, abonnement: 31.44 },
            { puissance: 24, abonnement: 40.23 },
            { puissance: 30, abonnement: 48.43 },
            { puissance: 36, abonnement: 56.02 }
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

