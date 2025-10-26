abonnements.push(
    {
        name: "Mint Energie - Smart & Green",
        lastUpdate: "2025-10-24",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_21912_ONLINE_GREEN.pdf",
        prices: [
            { puissance: 3, abonnement: 14.72 },
            { puissance: 6, abonnement: 17.18 },
            { puissance: 9, abonnement: 18.45 },
            { puissance: 12, abonnement: 23.31 },
            { puissance: 15, abonnement: 26.98 },
            { puissance: 18, abonnement: 30.64 },
            { puissance: 24, abonnement: 39.17 },
            { puissance: 30, abonnement: 47.10 },
            { puissance: 36, abonnement: 54.43 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 19.52,  prixKwhHP: 19.52 }
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

