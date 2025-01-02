abonnements.push({
    name: "EDF - Zen Week-End HC",
    offer_type: "Marché",
    lastUpdate: "2024-12-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 13.09,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 9,
            abonnement: 16.82,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 12,
            abonnement: 20.28,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 15,
            abonnement: 23.57,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 18,
            abonnement: 26.84,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 24,
            abonnement: 33.70,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 30,
            abonnement: 39.94,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        },
        {
            puissance: 36,
            abonnement: 46.24,
            bleu: {
                prixKwhHP: 28.08,
                prixKwhHC: 20.41
            },
            weekend: {
                prixKwhHP: 20.41,
                prixKwhHC: 20.41
            }
        }],
    hc: [{
        start: { hour: 22, minute: 0 },
        end: { hour: 24, minute: 0 }
    },
    {
        start: { hour: 0, minute: 0 },
        end: { hour: 6, minute: 0 }
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