abonnements.push({
    name: "EDF - Zen Week-End Plus",
    offer_type: "TRV",
    lastUpdate: "2024-02-01",
    subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche/electricite-weekend/zen-week-end-plus.html",
    price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-week-end-plus.pdf",
    prices: [
        {
            puissance: 6,
            abonnement: 12.44,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 9,
            abonnement: 15.90,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 12,
            abonnement: 19.25,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 15,
            abonnement: 22.37,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 18,
            abonnement: 25.46,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 24,
            abonnement: 32.32,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 30,
            abonnement: 38.19,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        },
        {
            puissance: 36,
            abonnement: 43.99,
            bleu: {
                prixKwhHC: 29.03
            },
            weekend: {
                prixKwhHC: 21.08
            }
        }],
    hc: [{
        start: {hour:0, minute:0},
        end: {hour:24, minute:0}
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