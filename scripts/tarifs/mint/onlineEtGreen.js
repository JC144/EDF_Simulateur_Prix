abonnements.push(
    {
        name: "Mint Energie - Online & Green",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14512_ONLINE_GREEN.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 6,
            abonnement: 12.71,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 9,
            abonnement: 15.96,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 12,
            abonnement: 19.26,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 15,
            abonnement: 22.35,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 18,
            abonnement: 25.42,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 24,
            abonnement: 32.20,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 30,
            abonnement: 38.00,
            bleu: {
                prixKwhHC: 20.64
            }
        },
        {
            puissance: 36,
            abonnement: 44.81,
            bleu: {
                prixKwhHC: 20.64
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

