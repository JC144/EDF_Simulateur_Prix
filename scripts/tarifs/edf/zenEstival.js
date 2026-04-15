abonnements.push(
    {
        name: "EDF - Zen Estival",
        offer_type: "Marché",
        lastUpdate: "2026-03-31",
        isCommunity: false,
        subscription_url: "https://particulier.edf.fr/fr/accueil/electricite-gaz/zen-estival.html",
        price_url: "https://particulier.edf.fr/content/dam/2-Actifs/Documents/Offres/grille-prix-zen-estival.pdf",
        prices: [
            { puissance: 3, abonnement: 12.03 },
            { puissance: 6, abonnement: 15.65 },
            { puissance: 9, abonnement: 19.56 },
            { puissance: 12, abonnement: 23.32 },
            { puissance: 15, abonnement: 26.84 },
            { puissance: 18, abonnement: 30.49 },
            { puissance: 24, abonnement: 38.24 },
            { puissance: 30, abonnement: 45.37 },
            { puissance: 36, abonnement: 52.54 }
        ].map(item => ({
            ...item,
            hiver: { prixKwhHC: 20.62, prixKwhHP: 26.27 },
            hiverSC: { prixKwhHC: 19.28 },
            ete: { prixKwhHC: 13.04, prixKwhHP: 15.22 },
            eteSC: { prixKwhHC: 9.87 }
        })),
        hc: [],
        hcByDayType: {
            hiver: [{
                start: { hour: 11, minute: 0 },
                end: { hour: 18, minute: 0 }
            }],
            hiverSC: [{
                start: { hour: 22, minute: 0 },
                end: { hour: 24, minute: 0 }
            },
            {
                start: { hour: 0, minute: 0 },
                end: { hour: 7, minute: 0 }
            }],
            ete: [{
                start: { hour: 22, minute: 0 },
                end: { hour: 0, minute: 0 }
            },
            {
                start: { hour: 0, minute: 0 },
                end: { hour: 7, minute: 0 }
            }],
            eteSC: [{
                start: { hour: 11, minute: 0 },
                end: { hour: 18, minute: 0 }
            }]
        },
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day, time) {
            let checkDate = day.date;
            if (time.hour < 6) {
                let dateObj = new Date(day.date + " 12:00:00");
                dateObj.setDate(dateObj.getDate() - 1);
                checkDate = dateObj.toISOString().split("T")[0].replace(/-/g, "/");
            }
            const month = checkDate.split("/").map(Number)[1];
            var season = (month >= 11 || month <= 3) ? "hiver" : "ete";

            //TODO
            // Gestion heures super creuses. A refactoriser.
            if (season === "ete" && (time.hour >= 11 && time.hour < 18)) {
                season += "SC";
            }
            else if (season === "hiver" && ((time.hour >= 22 && time.hour < 24) || (time.hour >= 0 && time.hour < 7))) {
                season += "SC";
            }
            return season;
        }
    }
);
