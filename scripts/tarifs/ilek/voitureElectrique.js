defineTarif({
    name: "ilek - Voiture électrique",
    eligibility: "Offre pour les détenteurs d’un véhicule électrique et d’un compteur Linky communicant.",
    offer_type: "Marché",
    lastUpdate: "2026-08-01",
    isCommunity: true,
    subscription_url: "https://www.ilek.fr/offre-electricite/voiture-electrique",
    price_url: "https://ilek.s3.amazonaws.com/uploads/producer/price_list_file/275/grille_offre_ve.pdf",
    subscriptions: {
        6: 28.45,
        9: 39.26,
        12: 45.82,
        15: 52.27,
        18: 57.92,
        24: 69.85,
        30: 74.81,
        36: 89.05
    },
    dayTypes: {
        hsc: {
            price: 10.64
        },
        bleu: {
            HC: 15.89,
            HP: 21.42
        }
    },
    dayRule: {
        type: "constant",
        dayType: "bleu",
        hourSubTypes: [
            {
                fromHour: 3,
                toHour: 7,
                dayType: "hsc"
            }
        ]
    },
    hcRanges: [
        {
            from: "01:00",
            to: "07:00"
        },
        {
            from: "13:00",
            to: "15:00"
        }
    ]
});
