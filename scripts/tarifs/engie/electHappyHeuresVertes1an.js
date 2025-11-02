abonnements.push(
    {
        name: "Engie - Happy Heures Vertes - 13h/15h - 1 an",
        lastUpdate: "2025-10-27",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-happy_heures-vertes-1-an.pdf",
        prices: [
            { puissance: 6, abonnement: 192.07 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 9, abonnement: 242.53 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 12, abonnement: 291.41 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 15, abonnement: 337.85 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 18, abonnement: 385.57 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 24, abonnement: 486.36 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 30, abonnement: 580.09 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 36, abonnement: 674.39 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } }
        ],
        hc: [
        {
            start: { hour: 0, minute: 0 },
            end: { hour: 6, minute: 0 }
        }],
        happy: [{
            start: { hour: 13, minute: 0 },
            end: { hour: 15, minute: 0 }
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day, time) {
            let dayType = "bleu";
            const hour = time.hour;
            const minute = time.minute;
            const timeInMinutes = hour * 60 + minute;

            // Vérifier si on est dans les heures "happy"
            for (let range of this.happy) {
                const rangeStart = range.start.hour * 60 + range.start.minute;
                const rangeEnd = range.end.hour * 60 + range.end.minute;

                if (timeInMinutes >= rangeStart && timeInMinutes < rangeEnd) {
                    dayType = "happy";
                    break;
                }
            }

            return dayType;
        }
    }
);

abonnements.push(
    {
        name: "Engie - Happy Heures Vertes - 14h/16h - 1 an",
        lastUpdate: "2025-10-27",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-happy_heures-vertes-1-an.pdf",
        prices: [
            { puissance: 6, abonnement: 192.07 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 9, abonnement: 242.53 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 12, abonnement: 291.41 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 15, abonnement: 337.85 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 18, abonnement: 385.57 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 24, abonnement: 486.36 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 30, abonnement: 580.09 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 36, abonnement: 674.39 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } }
        ],
        hc: [
        {
            start: { hour: 0, minute: 0 },
            end: { hour: 6, minute: 0 }
        }],
        happy: [{
            start: { hour: 14, minute: 0 },
            end: { hour: 16, minute: 0 }
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day, time) {
            let dayType = "bleu";
            const hour = time.hour;
            const minute = time.minute;
            const timeInMinutes = hour * 60 + minute;

            // Vérifier si on est dans les heures "happy"
            for (let range of this.happy) {
                const rangeStart = range.start.hour * 60 + range.start.minute;
                const rangeEnd = range.end.hour * 60 + range.end.minute;

                if (timeInMinutes >= rangeStart && timeInMinutes < rangeEnd) {
                    dayType = "happy";
                    break;
                }
            }

            return dayType;
        }
    }
);

abonnements.push(
    {
        name: "Engie - Happy Heures Vertes - 15h/17h - 1 an",
        lastUpdate: "2025-10-27",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-happy_heures-vertes-1-an.pdf",
        prices: [
            { puissance: 6, abonnement: 192.07 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 9, abonnement: 242.53 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 12, abonnement: 291.41 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 15, abonnement: 337.85 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 18, abonnement: 385.57 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 24, abonnement: 486.36 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 30, abonnement: 580.09 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } },
            { puissance: 36, abonnement: 674.39 / 12, bleu: { prixKwhHP: 24.480, prixKwhHC: 19.078 }, happy: { prixKwhHP: 3.598, prixKwhHC: 3.598 } }
        ],
        hc: [
        {
            start: { hour: 0, minute: 0 },
            end: { hour: 6, minute: 0 }
        }],
        happy: [{
            start: { hour: 15, minute: 0 },
            end: { hour: 17, minute: 0 }
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day, time) {
            let dayType = "bleu";
            const hour = time.hour;
            const minute = time.minute;
            const timeInMinutes = hour * 60 + minute;

            // Vérifier si on est dans les heures "happy"
            for (let range of this.happy) {
                const rangeStart = range.start.hour * 60 + range.start.minute;
                const rangeEnd = range.end.hour * 60 + range.end.minute;

                if (timeInMinutes >= rangeStart && timeInMinutes < rangeEnd) {
                    dayType = "happy";
                    break;
                }
            }

            return dayType;
        }
    }
);


