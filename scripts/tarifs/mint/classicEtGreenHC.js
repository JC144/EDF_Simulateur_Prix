defineTarif({
    name: "Mint Energie - Classic & Green HC",
    offer_type: "Marché",
    lastUpdate: "2026-10-20",
    isCommunity: true,
    subscription_url: "https://www.mint-energie.com/Pages/Informations/tarifs_elec.aspx",
    price_url: "https://doc.mint-energie.com/MintEnergie/MINT_ENERGIE_Fiche_Tarifs_28000_CLASSIC_GREEN.pdf",
    subscriptions: {
        6: 16.05,
        9: 20.16,
        12: 24.13,
        15: 27.86,
        18: 31.7,
        24: 39.88,
        30: 47.4,
        36: 54.99
    },
    dayTypes: { bleu: { HP: 24.08, HC: 17.72 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]
});
