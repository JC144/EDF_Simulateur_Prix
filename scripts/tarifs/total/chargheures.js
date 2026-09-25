defineTarif({
    name: "TotalEnergie - Charge'Heures",
    offer_type: "Marché",
    lastUpdate: "2026-09-01",
    isCommunity: true,
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-charge-heures",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-charge-heures-particuliers.pdf",
    subscriptions: {
        6: 15.69,
        7: 17,
        8: 18.31,
        9: 19.9,
        10: 21.19,
        11: 22.48,
        12: 24.01,
        13: 25.24,
        14: 26.47,
        15: 27.71,
        16: 28.99,
        17: 30.27,
        18: 31.15,
        19: 32.48,
        20: 33.8,
        21: 35.13,
        22: 36.46,
        23: 37.79,
        24: 39.11,
        25: 40.33,
        26: 41.55,
        27: 42.77,
        28: 43.99,
        29: 45.21,
        30: 46.45,
        31: 47.68,
        32: 48.92,
        33: 50.15,
        34: 51.38,
        35: 52.61,
        36: 52.72
    },
    // Les heures super creuses (2h-6h) n'ont qu'un prix : elles sont
    // entièrement couvertes par les plages HC ci-dessous.
    dayTypes: {
        base: { HP: 23.02, HC: 15.76 },
        hsc: { price: 13.35 }
    },
    dayRule: {
        type: "constant",
        dayType: "base",
        hourSubTypes: [{ fromHour: 2, toHour: 6, dayType: "hsc" }]
    },
    hcRanges: [{ from: "23:00", to: "24:00" }, { from: "00:00", to: "07:00" }]
});
