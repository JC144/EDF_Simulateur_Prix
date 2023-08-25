abonnements.push({
    name: "Zen Week-End HC",
    prices: [
        {
            puissance: 6,
            abonnement: 13.03,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        },
        {
            puissance: 36,
            abonnement: 45.72,
            bleu: {
                prixKwhHP: 26.83,
                prixKwhHC: 18.81
            },
            weekend: {
                prixKwhHP: 18.81,
                prixKwhHC: 18.81
            }
        }],
    hc: [{
        start: 22,
        end: 24
    },
    {
        start: 0,
        end: 6
    }],
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