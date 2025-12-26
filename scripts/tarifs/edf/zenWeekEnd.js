abonnements.push({
    name: "EDF - Zen Week-End",
    offer_type: "Marché",
    hasSpecialDaysCustom: false,
    lastUpdate: "2025-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        { puissance: 3, abonnement: 11.73 },
        { puissance: 6, abonnement: 15.47 },
        { puissance: 9, abonnement: 19.39 },
        { puissance: 12, abonnement: 23.32 },
        { puissance: 15, abonnement: 27.06 },
        { puissance: 18, abonnement: 30.76 },
        { puissance: 24, abonnement: 38.79 },
        { puissance: 30, abonnement: 46.44 },
        { puissance: 36, abonnement: 54.29 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 20.28,
        },
        weekend: {
            prixKwhHC: 15.27
        }
    })),
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [0, 6],
    getDayType: function (day) {
        let dayType = "bleu";

        const isoDate = new Date(day.date);
        const dayOfWeek = isoDate.getDay();

        if (this.specialDays.includes(dayOfWeek)) {
            dayType = "weekend";
        }

        return dayType;
    }
});

abonnements.push({
    name: "EDF - Zen Week-End HC",
    offer_type: "Marché",
    lastUpdate: "2025-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        { puissance: 6, abonnement: 15.74 },
        { puissance: 9, abonnement: 19.81 },
        { puissance: 12, abonnement: 23.76 },
        { puissance: 15, abonnement: 27.49 },
        { puissance: 18, abonnement: 31.34 },
        { puissance: 24, abonnement: 39.47 },
        { puissance: 30, abonnement: 47.02 },
        { puissance: 36, abonnement: 54.61 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHP: 21.43,
            prixKwhHC: 16.08
        },
        weekend: {
            prixKwhHP: 16.08,
            prixKwhHC: 16.08
        }
    })),
    hc: [{
        start: { hour: 22, minute: 0 },
        end: { hour: 24, minute: 0 }
    },
    {
        start: { hour: 0, minute: 0 },
        end: { hour: 6, minute: 0 }
    }],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [0, 6],
    getDayType: function (day) {
        let dayType = "bleu";

        const isoDate = new Date(day.date);
        const dayOfWeek = isoDate.getDay();

        if (this.specialDays.includes(dayOfWeek)) {
            dayType = "weekend";
        }

        return dayType;
    }
});

abonnements.push({
    name: "EDF - Zen Week-End Option Flex",
    offer_type: "Marché",
    lastUpdate: "2025-09-15",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-flex.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        { puissance: 6, abonnement: 15.74 },
        { puissance: 9, abonnement: 19.81 },
        { puissance: 12, abonnement: 23.76 },
        { puissance: 15, abonnement: 27.49 },
        { puissance: 18, abonnement: 31.34 },
        { puissance: 24, abonnement: 39.47 },
        { puissance: 30, abonnement: 47.02 },
        { puissance: 36, abonnement: 54.61 }
    ].map(item => ({
        ...item,
        bleu: {
            prixKwhHC: 15.08,
            prixKwhHP: 20.81
        },
        sobriete: {
            prixKwhHC: 20.81,
            prixKwhHP: 72.43
        }
    })),
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 8, minute: 0 }
    },
    {
        start: { hour: 13, minute: 0 },
        end: { hour: 18, minute: 0 }
    },
    {
        start: { hour: 20, minute: 0 },
        end: { hour: 24, minute: 0 }
    }],
    hasHCCustom: false,
    hasSpecialDaysCustom: false,
    specialDays: [{
        name: "sobriete",
        numberOfDays: 20,
        monthBegin: 10,
        monthEnd: 4,
        lastDays: [
            "2021/01/05",
            "2021/01/06",
            "2020/01/07",
            "2020/01/20",
            "2020/01/21",
            "2020/01/22",
            "2020/01/23",
            "2020/01/24",
            "2020/01/29",
            "2020/02/05",
            "2020/02/06",
            "2020/02/19",
            "2020/03/02",
            "2020/03/03",
            "2020/03/04",
            "2020/03/05",
            "2020/03/06",
            "2020/12/02",
            "2020/12/07",
            "2020/12/08",
            "2021/01/06",
            "2021/01/07",
            "2021/01/08",
            "2021/01/11",
            "2021/01/12",
            "2021/01/13",
            "2021/01/15",
            "2021/01/18",
            "2021/01/25",
            "2021/01/26",
            "2021/01/27",
            "2021/02/08",
            "2021/02/09",
            "2021/02/10",
            "2021/02/11",
            "2021/11/29",
            "2021/12/13",
            "2021/12/14",
            "2021/12/15",
            "2021/12/20",
            "2022/01/06",
            "2022/01/07",
            "2022/01/08",
            "2022/01/09",
            "2022/01/10",
            "2022/01/11",
            "2022/01/12",
            "2022/01/13",
            "2022/01/14",
            "2022/01/17",
            "2022/01/18",
            "2022/01/19",
            "2022/01/20",
            "2022/01/21",
            "2022/01/24",
            "2022/01/25",
            "2022/12/08",
            "2022/12/12",
            "2022/12/13",
            "2022/12/14",
            "2023/11/29",
            "2023/12/06",
            "2023/12/15",
            "2023/12/18",
            "2023/12/20",
            "2023/12/21",
            "2023/12/22",
            "2024/01/08",
            "2024/01/09",
            "2024/01/10",
            "2024/01/11",
            "2024/01/12",
            "2024/01/15",
            "2024/01/16",
            "2024/01/19",
            "2024/03/04",
            "2024/03/06",
            "2024/03/07",
            "2024/12/03",
            "2024/12/09",
            "2024/12/10",
            "2024/12/11",
            "2024/12/12",
            "2024/12/13",
            "2024/12/16",
            "2024/12/17",
            "2024/12/20",
            "2025/01/02",
            "2025/01/03",
            "2025/01/10",
            "2025/01/13",
            "2025/01/14",
            "2025/01/15",
            "2025/01/16",
            "2025/01/17",
            "2025/01/20",
            "2025/01/21",
            "2025/01/22",
            "2025/02/04",
            "2025/02/07",
            "2025/03/14",
            "2025/12/16",
            "2025/12/17",
            "2025/12/18",
            "2025/12/19"
        ]
    }],
    getDayType: function (day) {
        let dayType = "bleu";

        this.specialDays.forEach((specialDay) => {
            if (specialDay.lastDays.includes(day.date)) {
                dayType = specialDay.name;
            }
        });

        return dayType;
    }
});
