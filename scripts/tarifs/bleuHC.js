var tarifBleuHC = {
    prices: [
        {
            puissance: 6,
            abonnement: 12.35,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 9,
            abonnement: 16.03,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 12,
            abonnement: 19.34,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 15,
            abonnement: 22.50,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 18,
            abonnement: 25.58,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 24,
            abonnement: 31.69,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 30,
            abonnement: 37.68,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        },
        {
            puissance: 36,
            abonnement: 42.42,
            prixKwhHP: 22.28,
            prixKwhHC: 16.15
        }],
    hc: {
        start: 22,
        end: 7
    },
    hp: {
        start: 8,
        end: 21
    },
    getTarif: function (puissance, data) {
        let yearData = {
            months: [],
            price: 0
        };

        let abonnement = this.prices.find((t) => t.puissance == puissance);
        if (abonnement) {
            let currentMonth = 0;

            let monthData = {};
            for (let day = 0; day < data.length; day++) {
                let date = data[day].date.split("/");
                if (date[1] != currentMonth) {
                    if (monthData.days) {
                        monthData.conso = monthData.days.reduce((a, b) => a + b.conso, 0);
                        monthData.price = monthData.days.reduce((a, b) => a + b.price, 0) + abonnement.abonnement;
                    }
                    currentMonth = date[1];
                    monthData = {};
                    monthData.month = date[1];
                    monthData.days = [];
                    yearData.months.push(monthData);
                }

                let dayData = {
                    date: data[day].date,
                    hours: []
                };

                for (let hour = 0; hour < data[day].hours.length - 1; hour += 2) {
                    let hourData = {};

                    hourData.hour = data[day].hours[hour][0].split(":")[0] + ":00:00";
                    hourData.conso = (parseInt(data[day].hours[hour][1]) + parseInt(data[day].hours[hour + 1][1])) / 2;

                    let currentHour = parseInt(data[day].hours[hour][0].split(":")[0]);
                    if (currentHour >= this.hc.start || currentHour <= this.hc.end) {
                        hourData.price = (((hourData.conso / 1000) * parseInt(abonnement.prixKwhHC)) / 100);
                    }
                    else {
                        hourData.price = (((hourData.conso / 1000) * parseInt(abonnement.prixKwhHP)) / 100);
                    }
                    dayData.hours.push(hourData);
                }
                dayData.conso = dayData.hours.reduce((a, b) => a + b.conso, 0);
                dayData.price = dayData.hours.reduce((a, b) => a + b.price, 0);
                monthData.days.push(dayData);
            }
            monthData.conso = monthData.days.reduce((a, b) => a + b.conso, 0);
            monthData.price = monthData.days.reduce((a, b) => a + b.price, 0) + abonnement.abonnement;
            yearData.conso = yearData.months.reduce((a, b) => a + b.conso, 0);
            yearData.price = yearData.months.reduce((a, b) => a + b.price, 0);
        }

        return yearData;
    }
}