abonnements.push(
    {
        name: "OHM Energie - Offre soir et Week-End",
        lastUpdate: "2024-02-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/02/ELEC_S%26WE.pdf",
        prices: [
        {
            puissance: 3,
            abonnement: 9.95,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 6,
            abonnement: 13.62,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 9,
            abonnement: 17.33,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 12,
            abonnement: 20.95,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 15,
            abonnement: 24.41,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 18,
            abonnement: 27.84,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 24,
            abonnement: 35.03,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 30,
            abonnement: 40.43,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
            }
        },
        {
            puissance: 36,
            abonnement: 46.88,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.43
            },
            weekend: {
                prixKwhHP: 17.43,
                prixKwhHC: 17.43
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