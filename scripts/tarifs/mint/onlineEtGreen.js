defineTarif({
    name: "Mint Energie - Online & Green",
    offer_type: "Marché",
    lastUpdate: "2026-10-08",
    isCommunity: true,
    subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
    price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_22112_ONLINE_GREEN.pdf",
    subscriptions: {
        3: 12.13,
        6: 15.86,
        9: 19.88,
        12: 23.76,
        15: 27.4,
        18: 31.14,
        24: 39.14,
        30: 46.47,
        36: 53.88
    },
    dayTypes: { bleu: { price: 19.04 } },
    // 3 et 6 kVA ont un prix du kWh plus élevé
    priceOverrides: { 3: { bleu: { price: 19.19 } }, 6: { bleu: { price: 19.19 } } },
    dayRule: { type: "constant", dayType: "bleu" }
});
