{
    const prixAbonnements = {
        // puissance: abonnement TTC
        6: 15.96,
        7: 17.34,
        8: 18.73,
        9: 20.52,
        10: 21.92,
        11: 23.31,
        12: 25.08,
        13: 26.43,
        14: 27.78,
        15: 29.13,
        16: 30.52,
        17: 31.91,
        18: 32.77,
        19: 34.20,
        20: 35.63,
        21: 37.06,
        22: 38.49,
        23: 39.92,
        24: 41.32,
        25: 42.61,
        26: 43.89,
        27: 45.18,
        28: 46.47,
        29: 47.75,
        30: 49.06,
        31: 50.38,
        32: 51.70,
        33: 53.03,
        34: 54.35,
        35: 55.67,
        36: 55.43,
    }

    abonnements.push(
        {
            name: "TotalEnergie - Charge'Heures",
            lastUpdate: "2025-10-24",
            subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-charge-heures",
            price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-charge-heures-particuliers.pdf",
            prices: Object.keys(prixAbonnements).map((puissance) => ({
                puissance,
                abonnement: prixAbonnements[puissance],
                base: {
                    prixKwhHP: 21.62,
                    prixKwhHC: 16.51,
                },
                hsc: {
                    prixKwhHC: 12.61,
                }
            })),
            hc: [{
                start: { hour: 23, minute: 0 },
                end: { hour: 24, minute: 0 }
            },
            {
                start: { hour: 0, minute: 0 },
                end: { hour: 7, minute: 0 }
            }],
            hasHCCustom: false,
            hasSpecialDaysCustom: false,
            specialDays: [],
            getDayType: function (day, { hour }) {
                if (hour >= 2 && hour < 6) {
                    return "hsc";
                }
                return "base";
            }
        }
    );
}