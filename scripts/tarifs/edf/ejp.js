abonnements.push({
    name: "EDF - EJP",
    offer_type: "TRV",
    lastUpdate: "2024-11-01",
    isCommunity: false,
    subscription_url: "",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/Grille_prix_EJP.pdf",
    prices: [
        {
            puissance: 9,
            abonnement: 15.90,
            bleu: {
                prixKwhHP: 17.58,
                prixKwhHC: 17.58
            },
            rouge: {
                prixKwhHP: 151.97,
                prixKwhHC: 17.58
            }
        },
        {
            puissance: 12,
            abonnement: 18.87,
            bleu: {
                prixKwhHP: 17.58,
                prixKwhHC: 17.58
            },
            rouge: {
                prixKwhHP: 151.97,
                prixKwhHC: 17.58
            }
        },
        {
            puissance: 15,
            abonnement: 21.92,
            bleu: {
                prixKwhHP: 17.58,
                prixKwhHC: 17.58
            },
            rouge: {
                prixKwhHP: 151.97,
                prixKwhHC: 17.58
            }
        },
        {
            puissance: 18,
            abonnement: 24.86,
            bleu: {
                prixKwhHP: 17.58,
                prixKwhHC: 17.58
            },
            rouge: {
                prixKwhHP: 151.97,
                prixKwhHC: 17.58
            }
        },
        {
            puissance: 36,
            abonnement: 43.41,
            bleu: {
                prixKwhHP: 17.58,
                prixKwhHC: 17.58
            },
            rouge: {
                prixKwhHP: 151.97,
                prixKwhHC: 17.58
            }
        }],
    hc: [{
        start: { hour: 1, minute: 0 },
        end: { hour: 7, minute: 0 }
    }],
    specialDays: [{
        name: "rouge",
        numberOfDays: 22,
        monthBegin: 11,
        monthEnd: 3,
        lastDays: [
            "2020/11/30",
            "2020/12/01",
            "2020/12/02",
            "2020/12/03",
            "2020/12/04",
            "2020/12/07",
            "2020/12/08",
            "2020/12/09",
            "2020/12/10",
            "2020/12/18",
            "2021/01/04",
            "2021/01/05",
            "2021/01/06",
            "2021/01/07",
            "2021/01/08",
            "2021/01/11",
            "2021/01/26",
            "2021/02/11",
            "2021/02/12",
            "2021/03/23",
            "2021/03/18",
            "2021/03/17",
            "2021/11/29",
            "2022/01/06",
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
            "2022/03/01",
            "2022/03/02",
            "2022/03/03",
            "2022/03/07",
            "2022/03/08",
            "2022/03/15",
            "2022/03/22",
            "2022/03/23",
            "2022/03/29",
            "2022/12/08",
            "2022/12/12",
            "2022/12/13",
            "2022/12/14",
            "2023/01/19",
            "2023/01/20",
            "2023/01/23",
            "2023/01/24",
            "2023/01/25",
            "2023/01/27",
            "2023/02/07",
            "2023/02/09",
            "2023/02/10",
            "2023/02/28",
            "2023/03/01",
            "2023/03/02",
            "2023/03/03",
            "2023/03/06",
            "2023/03/07",
            "2023/03/08",
            "2023/03/09",
            "2023/03/15",
            "2023/11/29",
            "2023/11/30",
            "2023/12/01",
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
            "2024/01/18",
            "2024/01/19",
            "2024/02/26",
            "2024/02/27",
            "2024/02/28",
            "2024/03/04",
            "2024/03/05",
            "2024/03/06",
            "2024/03/07",
            "2024/03/11",
            "2024/11/13",
            "2024/11/14",
            "2024/12/03",
            "2024/12/04",
            "2024/12/09",
            "2024/12/10",
            "2024/12/11",
            "2024/12/12",
            "2024/12/13"
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