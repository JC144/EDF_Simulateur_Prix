abonnements.push({
    name: "EDF - Zen Week-End Plus HC",
    offer_type: "TRV",
    lastUpdate: "2024-03-19",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.19,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 9,
            abonnement: 16.71,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 12,
            abonnement: 20.13,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 15,
            abonnement: 23.40,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 18,
            abonnement: 26.64,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 24,
            abonnement: 33.44,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 30,
            abonnement: 39.63,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
            }
        },
        {
            puissance: 36,
            abonnement: 45.88,
            bleu: {
                prixKwhHP: 28.74,
                prixKwhHC: 20.88
            },
            weekend: {
                prixKwhHP: 20.88,
                prixKwhHC: 20.88,
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