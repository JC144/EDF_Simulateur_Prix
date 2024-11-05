abonnements.push({
    name: "EDF - ZenFlex Week-End",
    offer_type: "TRV",
    hasSpecialDaysCustom: false,
    lastUpdate: "2024-11-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end.pdf",
    prices: [
        {
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 6,
            abonnement: 12.68,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 9,
            abonnement: 15.89,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 12,
            abonnement: 19.16,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 15,
            abonnement: 22.21,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 18,
            abonnement: 25.24,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 24,
            abonnement: 32.74,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 30,
            abonnement: 37.68,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        },
        {
            puissance: 36,
            abonnement: 44.43,
            bleu: {
                prixKwhHC: 26.29
            },
            weekend: {
                prixKwhHC: 19.16
            }
        }],
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
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