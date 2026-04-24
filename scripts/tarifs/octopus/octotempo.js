abonnements.push(
    {
        name: "Octopus - OctoTempo",
        offer_type: "Marché",
        lastUpdate: "2026-04-13",
        subscription_url: "https://octopusenergy.fr/octotempo",
        price_url: "https://a.storyblok.com/f/151412/x/c095a21c44/grille-tarifaire-octotempo.pdf",
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
            rouge: { prixKwhHC: 15.75,  prixKwhHP: 64.69 },
            hiver: { prixKwhHC: 15.75,  prixKwhHP: 18.71 },
            ete: { prixKwhHC: 13.25,  prixKwhHP: 15.75 }
        })),
        hc: [],
        hcByDayType: {
            rouge: [{
                start: { hour: 21, minute: 0 },
                end: { hour: 0, minute: 0 }
            },
            {
                start: { hour: 0, minute: 0 },
                end: { hour: 7, minute: 0 }
            }],
            hiver: [{
                start: { hour: 21, minute: 0 },
                end: { hour: 0, minute: 0 }
            },
            {
                start: { hour: 0, minute: 0 },
                end: { hour: 7, minute: 0 }
            }],
            ete: [{
                start: { hour: 21, minute: 0 },
                end: { hour: 0, minute: 0 }
            },
            {
                start: { hour: 0, minute: 0 },
                end: { hour: 7, minute: 0 }
            },
            {
                start: { hour: 11, minute: 0 },
                end: { hour: 17, minute: 0 }
            }]
        },
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: abonnements
            .find(item => item.name === "EDF - Tempo")
            .specialDays
            .filter(day => day.name === "rouge"),
        getDayType: function (day, time) {
            let checkDate = day.date;
            if (time.hour < 6) {
                let dateObj = new Date(day.date + " 12:00:00");
                dateObj.setDate(dateObj.getDate() - 1);
                checkDate = dateObj.toISOString().split("T")[0].replace(/-/g, "/");
            }
            const month = checkDate.split("/").map(Number)[1];
            let season = (month >= 11 || month <= 3) ? "hiver" : "ete";

            const tempo = this.specialDays[0];
            if (tempo.lastDays.includes(checkDate)) {
                season = "rouge";
            }

            return season;
        }
    }
);
