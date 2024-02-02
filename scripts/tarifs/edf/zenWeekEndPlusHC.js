abonnements.push({
    name: "EDF - Zen Week-End Plus HC",
    offer_type: "TRV",
    lastUpdate: "2024-02-01",
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.03,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 9,
            abonnement: 16.55,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 12,
            abonnement: 19.97,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 15,
            abonnement: 23.24,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 18,
            abonnement: 26.48,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 24,
            abonnement: 33.28,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 30,
            abonnement: 39.46,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
            }
        },
        {
            puissance: 36,
            abonnement: 45.72,
            bleu: {
                prixKwhHP: 30.17,
                prixKwhHC: 21.87
            },
            weekend: {
                prixKwhHP: 21.87,
                prixKwhHC: 21.87,
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