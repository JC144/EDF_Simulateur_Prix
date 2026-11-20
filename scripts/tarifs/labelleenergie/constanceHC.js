defineTarif({
    name: "La Belle Energie - Constance HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        6: 19.37,
        9: 23.67,
        12: 27.64,
        15: 31.37,
        18: 35.21,
        24: 43.39,
        30: 50.91,
        36: 58.5
    },
    dayTypes: { bleu: { HP: 21.42, HC: 15.89 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]
});
