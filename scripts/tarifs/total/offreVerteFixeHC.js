defineTarif({
    name: "TotalEnergie - Offre verte fixe HC",
    offer_type: "Marché",
    lastUpdate: "2026-09-24",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Documents-contractuels/GT/grille-tarifaire-verte-fixe-particuliers.pdf",
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
    dayTypes: { bleu: { HP: 27.28, HC: 19.92 } },
    dayRule: { type: "constant", dayType: "bleu" },
    hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]
});
