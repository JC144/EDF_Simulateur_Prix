abonnements.push(
    {
        name: "Mint Energie - Online & Green HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14512_ONLINE_GREEN.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 14.93,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 9,
            abonnement: 17.70,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 12,
            abonnement: 21.32,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 15,
            abonnement: 24.78,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 18,
            abonnement: 28.20,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 24,
            abonnement: 35.39,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 30,
            abonnement: 41.93,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        },
        {
            puissance: 36,
            abonnement: 47.44,
            bleu: {
                prixKwhHP: 20.39,
                prixKwhHC: 15.77
            }
        }],
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

