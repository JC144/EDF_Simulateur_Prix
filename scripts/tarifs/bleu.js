var tarifBleu = {
    prices: [{
        puissance: 3,
        abonnement: 9.13,
        prixKwh: 20.62
    },
    {
        puissance: 6,
        abonnement: 11.93,
        prixKwh: 20.62
    },
    {
        puissance: 9,
        abonnement: 14.86,
        prixKwh: 20.62
    },
    {
        puissance: 12,
        abonnement: 17.88,
        prixKwh: 20.62
    },
    {
        puissance: 15,
        abonnement: 20.85,
        prixKwh: 20.62
    },
    {
        puissance: 18,
        abonnement: 23.67,
        prixKwh: 20.62
    },
    {
        puissance: 24,
        abonnement: 29.82,
        prixKwh: 20.62
    },
    {
        puissance: 30,
        abonnement: 35.83,
        prixKwh: 20.62
    },
    {
        puissance: 36,
        abonnement: 41.71,
        prixKwh: 20.62
    }],
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
                    hourData.price = (((hourData.conso / 1000) * parseInt(abonnement.prixKwh)) / 100);
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

