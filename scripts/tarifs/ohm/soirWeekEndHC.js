abonnements.push(
    {
        name: "OHM Energie - Offre soir et Week-End",
        offer_type: "Marché",
        lastUpdate: "2024-02-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/02/ELEC_S%26WE.pdf",
        prices: [
        {
            puissance: 3,
            abonnement: 10.11,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 6,
            abonnement: 13.78,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 9,
            abonnement: 17.49,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 12,
            abonnement: 21.12,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 15,
            abonnement: 24.57,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 18,
            abonnement: 28.00,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 24,
            abonnement: 35.19,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 30,
            abonnement: 41.75,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
            }
        },
        {
            puissance: 36,
            abonnement: 48.37,
            bleu: {
                prixKwhHP: 27.29,
                prixKwhHC: 17.38
            },
            weekend: {
                prixKwhHP: 17.38,
                prixKwhHC: 17.38
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