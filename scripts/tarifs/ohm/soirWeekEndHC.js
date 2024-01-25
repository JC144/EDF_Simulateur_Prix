abonnements.push(
    {
        name: "OHM Energie - Offre soir et Week-End",
        lastUpdate: "2023-09-14",
        prices: [
        {
            puissance: 3,
            abonnement: 9.66,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 6,
            abonnement: 13.23,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 9,
            abonnement: 16.84,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 12,
            abonnement: 20.36,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 15,
            abonnement: 23.73,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 18,
            abonnement: 27.06,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 24,
            abonnement: 34.06,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 30,
            abonnement: 40.43,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        },
        {
            puissance: 36,
            abonnement: 46.88,
            bleu: {
                prixKwhHP: 29.91,
                prixKwhHC: 17.99
            },
            weekend: {
                prixKwhHP: 17.99,
                prixKwhHC: 17.99
            }
        }],
    hc: [{
        start: {hour:22, minute:0},
        end: {hour:24, minute:0}
    },
    {
        start: {hour:0, minute:0},
        end: {hour:6, minute:0}
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