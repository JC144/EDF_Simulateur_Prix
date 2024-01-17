abonnements.push({
    name: "ZenFlex",
    lastUpdate: "2023-09-14",
    prices: [
        {
            puissance: 6,
            abonnement: 13.03,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        },
        {
            puissance: 36,
            abonnement: 45.72,
            bleu: {
                prixKwhHP: 24.60,
                prixKwhHC: 14.64
            },
            sobriete: {
                prixKwhHP: 73.24,
                prixKwhHC: 24.60
            }
        }],
    hc: [{
        start: 0,
        end: 8
    },
    {
        start: 13,
        end: 18
    },
    {
        start: 20,
        end: 24
    }],
    specialDays: [{
        name: "sobriete",
        numberOfDays: 20,
        monthBegin: 10,
        monthEnd: 4,
        lastDays:[
            "2020-12-02",
            "2020-12-07",
            "2020-12-08",
            "2020-12-09",
            "2020-12-31",
            "2021-01-04",
            "2021-01-05",
            "2021-01-06",
            "2020-01-07",
            "2020-01-20",
            "2020-01-21",
            "2020-01-22",
            "2020-01-23",
            "2020-01-24",
            "2020-01-29",
            "2020-02-05",
            "2020-02-06",
            "2020-02-19",
            "2020-03-02",
            "2020-03-03",
            "2020-03-04",
            "2020-03-05",
            "2020-03-06",
            "2020-12-02",
            "2020-12-07",
            "2020-12-08",
            "2021-01-04",
            "2021-01-05",
            "2021-01-06",
            "2021-01-07",
            "2021-01-08",
            "2021-01-11",
            "2021-01-12",
            "2021-01-13",
            "2021-01-15",
            "2021-01-18",
            "2021-01-25",
            "2021-01-26",
            "2021-01-27",
            "2021-02-08",
            "2021-02-09",
            "2021-02-10",
            "2021-02-11",
            "2021-11-29",
            "2021-12-13",
            "2021-12-14",
            "2021-12-15",
            "2021-12-20",
            "2022-12-08",
            "2022-12-12",
            "2022-12-13",
            "2022-12-14",
            "2022-12-08",
            "2022-01-06",
            "2022-01-10",
            "2022-01-11",
            "2022-01-12",
            "2022-01-13",
            "2022-01-14",
            "2022-01-17",
            "2022-01-18",
            "2022-01-19",
            "2022-01-20",
            "2022-01-21",
            "2022-01-24",
            "2022-01-25",
            "2022-12-08",
            "2022-12-12",
            "2022-12-13",
            "2022-12-14",
            "2023-01-17",
            "2023-01-18",
            "2023-01-19",
            "2023-01-20",
            "2023-01-23",
            "2023-01-24",
            "2023-01-25",
            "2023-01-26",
            "2023-01-27",
            "2023-01-30",
            "2023-01-31",
            "2023-02-06",
            "2023-02-07",
            "2023-02-08",
            "2023-02-09",
            "2023-02-10",
            "2023-11-29",
            "2023-12-06",
            "2023-12-15",
            "2023-12-18",
            "2023-12-20",
            "2023-12-21",
            "2023-12-22",
            "2024/01/04",
            "2024/01/05",
            "2024/01/06",
            "2024/01/13",
            "2024/01/17"
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