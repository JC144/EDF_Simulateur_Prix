abonnements.push({
    name: "TotalEnergie - Heures Eco+",
    lastUpdate: "2024-02-01",
    subscription_url: "https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-plus-electricite",
    price_url: "https://www.totalenergies.fr/fileadmin/Digital/Groupe/PDF/Documents_contractuels/Particuliers/Tarifs_TotalEnergies/fr/grille-tarifaire-heures-eco-plus-particuliers.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        },
        {
            puissance: 12,
            abonnement: 20.36,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        },
        {
            puissance: 15,
            abonnement: 23.73,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        },
        {
            puissance: 36,
            abonnement: 44.63,
            bleu: {
                prixKwhHP: 25.74,
                prixKwhHC: 18.84
            },
            vigilance: {
                prixKwhHP: 81.23,
                prixKwhHC: 81.23
            }
        }],
    hc: [{
        start: { hour: 22, minute: 0 },
        end: { hour: 24, minute: 0 }
    },
    {
        start: { hour: 0, minute: 0 },
        end: { hour: 6, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [{
        name: "vigilance",
        numberOfDays: 22,
        monthBegin: 11,
        monthEnd: 3,
        lastDays: [
            "2023/12/06",
            "2023/12/18",
            "2023/12/20",
            "2024/01/08",
            "2024/01/09",
            "2024/01/10",
            "2024/01/11",
            "2024/01/12",
            "2024/01/15",
            "2024/01/16",
            "2024/01/19"
        ]
    }],
    getDayType: function (day, time) {
        let dayType = "bleu";

        this.specialDays.forEach((specialDay) => {
            if (specialDay.lastDays.includes(day.date)) {
                //Les heures de vigilances vont de 7 à 15h et de 18 à 20h
                if ((time >= 7 && time < 15) || (time >= 18 && time < 20)) {
                    dayType = specialDay.name;
                }
            }
        });

        return dayType;
    }
});