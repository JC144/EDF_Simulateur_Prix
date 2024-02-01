abonnements.push({
    name: "EDF - ZenFlex Week-End",
    hasSpecialDaysCustom: false,
    lastUpdate: "2024-02-01",
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        {
            puissance: 3,
            abonnement: 9.47,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 9,
            abonnement: 15.63,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 12,
            abonnement: 19.25,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 15,
            abonnement: 22.37,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 18,
            abonnement: 25.46,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 24,
            abonnement: 32.32,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 30,
            abonnement: 37.29,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        },
        {
            puissance: 36,
            abonnement: 43.99,
            bleu: {
                prixKwhHC: 27.65
            },
            weekend: {
                prixKwhHC: 20.11
            }
        }],
    hc: [{
        start: {hour:0, minute:0},
        end: {hour:24, minute:0}
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