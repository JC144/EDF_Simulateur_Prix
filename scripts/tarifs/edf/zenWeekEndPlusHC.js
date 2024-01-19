abonnements.push({
    name: "EDF - Zen Week-End Plus HC",
    lastUpdate: "2023-09-14",
    prices: [
        {
            puissance: 6,
            abonnement: 13.03,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
            }
        },
        {
            puissance: 36,
            abonnement: 45.72,
            bleu: {
                prixKwhHP: 27.77,
                prixKwhHC: 19.47
            },
            weekend: {
                prixKwhHP: 19.47,
                prixKwhHC: 19.47,
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
    hasHCCustom: true,
    hasSpecialDaysCustom: true,
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