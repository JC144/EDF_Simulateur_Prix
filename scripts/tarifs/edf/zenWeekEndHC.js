abonnements.push({
    name: "EDF - Zen Week-End HC",
    lastUpdate: "2024-02-01",
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.03,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
            }
        },
        {
            puissance: 36,
            abonnement: 45.72,
            bleu: {
                prixKwhHP: 29.23,
                prixKwhHC: 21.21
            },
            weekend: {
                prixKwhHP: 21.21,
                prixKwhHC: 21.21
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