abonnements.push(
    {
        name: "Mint Energie - Online & Green",
        lastUpdate: "2025-10-24",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_21912_ONLINE_GREEN.pdf",
        prices: [
            { puissance: 3, abonnement: 11.73 },
            { puissance: 6, abonnement: 15.47 },
            { puissance: 9, abonnement: 19.39 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 27.06 },
            { puissance: 18, abonnement: 30.76 },
            { puissance: 24, abonnement: 38.79 },
            { puissance: 30, abonnement: 46.44 },
            { puissance: 36, abonnement: 54.29 }
        ].map(item => ({
            ...item,
            bleu: { prixKwhHC: 17.77,  prixKwhHP: 17.77 }
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

