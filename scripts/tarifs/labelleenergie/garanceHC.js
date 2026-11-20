defineTarif({
    name: "La Belle Energie - Garance HC",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    subscription_url: "https://labellenergie.fr/offre-electricite-verte/",
    price_url: "https://labellenergie.fr/pdf/grille-tarifaire-la-bellenergie-particuliers.pdf",
    subscriptions: {
        6: 20.87,
        9: 25.17,
        12: 29.14,
        15: 32.87,
        18: 36.71,
        24: 44.89,
        30: 52.41,
        36: 60
    },
    dayTypes: { bleu: { HP: 21.42, HC: 15.89 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]
});
