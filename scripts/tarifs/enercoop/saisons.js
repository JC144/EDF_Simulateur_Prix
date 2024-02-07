abonnements.push({
    name: "Enercoop - Haute Saison / Basse Saison",
    lastUpdate: "2024-02-01",
    subscription_url: "https://souscription.enercoop.fr",
    price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
    prices: [
        {
            puissance: 3,
            abonnement: 10.18,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 6,
            abonnement: 16.19,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 9,
            abonnement: 21.55,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 12,
            abonnement: 26.79,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 15,
            abonnement: 32.58,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 18,
            abonnement: 38.36,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 24,
            abonnement: 49.94,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 30,
            abonnement: 61.52,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        },
        {
            puissance: 36,
            abonnement: 73.09,
            basseSaison: {
                prixKwhHP: 18.916,
                prixKwhHC: 13.946
            },
            hauteSaison: {
                prixKwhHP: 27.058,
                prixKwhHC: 16.044
            }
        }],
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    getDayType: function (day) {
        let dayType = "basseSaison";
        const [currentyear, currentMonth, currentDay] = (day.date.split("/")).map(Number);

        if ((currentMonth >= 11 && currentDay >= 1) || (currentMonth <= 3 && currentDay <= 31)) {
            dayType = "hauteSaison";
        }

        return dayType;
    }
});