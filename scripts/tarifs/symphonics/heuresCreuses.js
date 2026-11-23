defineTarif({
    name: "Symphonics - Heures Creuses (solaire)",
    offer_type: "Marché",
    lastUpdate: "2026-11-01",
    isCommunity: true,
    eligibility: "Réservé aux foyers équipés de panneaux solaires ou en cours d’installation. Le résultat porte sur l’électricité achetée au réseau.",
    subscription_url: "https://symphonics.fr/grille-tarifaire-particulier/",
    price_url: "https://symphonics.fr/app/uploads/2026/11/Grille-Tarifaire-Particulier-V261029.pdf",
    subscriptions: {
        6: 16.99,
        9: 21.02,
        12: 24.89,
        15: 28.53,
        18: 32.27,
        24: 40.27,
        30: 47.6,
        36: 55.01
    },
    dayTypes: {
        bleu: {
            HP: 30.07,
            HC: 16.87
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu"
    },
    hcRanges: [
        {
            from: "00:00",
            to: "06:00"
        },
        {
            from: "14:00",
            to: "16:00"
        }
    ]
});
