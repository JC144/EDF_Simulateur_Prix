abonnements.push(
    {
        name: "Mint Energie - Classic & Green",
        lastUpdate: "2025-08-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_23012_CLASSIC_GREEN.pdf",
        prices: [
            { puissance: 3, abonnement: 13.52 },
            { puissance: 6, abonnement: 15.98 },
            { puissance: 9, abonnement: 17.25 },
            { puissance: 12, abonnement: 22.11 },
            { puissance: 15, abonnement: 25.78 },
            { puissance: 18, abonnement: 29.44 },
            { puissance: 24, abonnement: 37.97 },
            { puissance: 30, abonnement: 45.90 },
            { puissance: 36, abonnement: 53.23 }
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

