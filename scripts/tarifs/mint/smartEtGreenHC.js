abonnements.push(
    {
        name: "Mint Energie - Smart & Green HC",
        lastUpdate: "2024-02-01",
        subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
        price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_14512_ONLINE_GREEN.pdf",
        prices: [
        {
            puissance: 6,
            abonnement: 13.39,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 9,
            abonnement: 17.00,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 12,
            abonnement: 20.52,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 15,
            abonnement: 23.89,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 18,
            abonnement: 27.22,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 24,
            abonnement: 34.22,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 30,
            abonnement: 40.60,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
            }
        },
        {
            puissance: 36,
            abonnement: 47.04,
            bleu: {
                prixKwhHP: 27.00,
                prixKwhHC: 20.68
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

