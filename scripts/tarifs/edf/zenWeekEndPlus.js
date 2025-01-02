abonnements.push({
    name: "EDF - Zen Week-End Plus",
    offer_type: "Marché",
    lastUpdate: "2024-12-01",
    isCommunity: false,
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 12.68,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 9,
            abonnement: 16.18,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 12,
            abonnement: 19.55,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 15,
            abonnement: 22.21,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 18,
            abonnement: 25.24,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 24,
            abonnement: 31.96,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 30,
            abonnement: 37.68,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        },
        {
            puissance: 36,
            abonnement: 44.43,
            bleu: {
                prixKwhHC: 27.78
            },
            weekend: {
                prixKwhHC: 20.21
            }
        }],
    hc: [{
        start: { hour: 0, minute: 0 },
        end: { hour: 24, minute: 0 }
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