abonnements.push({
    name: "EDF - Zen Week-End Plus",
    lastUpdate: "2023-09-14",
    shiftTime: 30,    
    prices: [
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 9,
            abonnement: 15.90,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 12,
            abonnement: 19.25,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 15,
            abonnement: 22.37,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 18,
            abonnement: 25.46,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 24,
            abonnement: 32.32,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 30,
            abonnement: 38.19,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        },
        {
            puissance: 36,
            abonnement: 43.99,
            bleu: {
                prixKwhHC: 26.63
            },
            weekend: {
                prixKwhHC: 18.68
            }
        }],
    hc: [{
        start: 0,
        end: 24
    }],
    hasHCCustom: false,
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