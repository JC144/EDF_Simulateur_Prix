abonnements.push({
    name: "EDF - ZenFlex Week-End",
    hasSpecialDaysCustom: false,
    lastUpdate: "2023-09-14",
    shiftTime: 30,    
    prices: [
        {
            puissance: 3,
            abonnement: 9.47,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 9,
            abonnement: 15.63,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 12,
            abonnement: 19.25,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 15,
            abonnement: 22.37,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 18,
            abonnement: 25.46,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 24,
            abonnement: 32.32,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 30,
            abonnement: 37.29,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        },
        {
            puissance: 36,
            abonnement: 43.99,
            bleu: {
                prixKwhHC: 25.25
            },
            weekend: {
                prixKwhHC: 17.71
            }
        }],
    hc: [{
        start: 0,
        end: 24
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