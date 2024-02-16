{
    const prixAbonnements = {
        // puissance: abonnement TTC
        6: 12.85,
        7: 14.00,
        8: 15.14,
        9: 16.55,
        10: 17.69,
        11: 18.83,
        12: 20.36,
        13: 21.48,
        14: 22.61,
        15: 23.73,
        16: 24.84,
        17: 25.95,
        18: 26.48,
        19: 27.61,
        20: 28.75,
        21: 29.88,
        22: 31.01,
        23: 32.14,
        24: 33.28,
        25: 34.31,
        26: 35.34,
        27: 36.36,
        28: 37.39,
        29: 38.42,
        30: 39.46,
        31: 40.51,
        32: 41.56,
        33: 42.61,
        34: 43.65,
        35: 44.70,
        36: 44.63,
    }

    abonnements.push(
        {
            name: "TotalEnergie - Charge'Heures",
            lastUpdate: "2024-02-01",
            subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-charge-heures",
            price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-charge-heures-particuliers.pdf",
            prices: Object.keys(prixAbonnements).map((puissance) => ({
                puissance,
                abonnement: prixAbonnements[puissance],
                base: {
                    prixKwhHP: 27.95,
                    prixKwhHC: 20.68,
                },
                hsc: {
                    prixKwhHC: 15.24,
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