abonnements.push(
    {
        name: "Mint Energie - Smart & Green",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14712_SMART_GREEN.pdf",
        prices: [{
            puissance: 3,
            abonnement: 10.64,
            bleu: {
                prixKwhHC: 18.82
            }
        },
        {
            puissance: 6,
            abonnement: 13.91,
            bleu: {
                prixKwhHC: 18.82
            }
        },
        {
            puissance: 9,
            abonnement: 16.47,
            bleu: {
                prixKwhHC: 19.06
            }
        },
        {
            puissance: 12,
            abonnement: 19.86,
            bleu: {
                prixKwhHC: 19.06
            }
        },
        {
            puissance: 15,
            abonnement: 23.01,
            bleu: {
                prixKwhHC: 19.06
            }
        },
        {
            puissance: 18,
            abonnement: 26.15,
            bleu: {
                prixKwhHC: 19.06
            }
        },
        {
            puissance: 24,
            abonnement: 33.10,
            bleu: {
                prixKwhHC: 19.06
            }
        },
        {
            puissance: 30,
            abonnement: 39.02,
            bleu: {
                prixKwhHC: 19.06
            }
        },
        {
            puissance: 36,
            abonnement: 46.68,
            bleu: {
                prixKwhHC: 19.06
            }
        }],
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

