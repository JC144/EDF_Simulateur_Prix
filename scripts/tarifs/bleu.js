var tarifBleu = {
    prices: [{
        puissance: 3,
        abonnement: 9.47,
        prixKwh: 22.76
    },
    {
        puissance: 6,
        abonnement: 12.44,
        prixKwh: 22.76
    },
    {
        puissance: 9,
        abonnement: 15.63,
        prixKwh: 22.76
    },
    {
        puissance: 12,
        abonnement: 18.89,
        prixKwh: 22.76
    },
    {
        puissance: 15,
        abonnement: 21.92,
        prixKwh: 22.76
    },
    {
        puissance: 18,
        abonnement: 24.92,
        prixKwh: 22.76
    },
    {
        puissance: 24,
        abonnement: 31.60,
        prixKwh: 22.76
    },
    {
        puissance: 30,
        abonnement: 37.29,
        prixKwh: 22.76
    },
    {
        puissance: 36,
        abonnement: 44.66,
        prixKwh: 22.76
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
                dayData.priceHC = 0;
                dayData.priceHP = 0;

                for (let hour = 0; hour < data[day].hours.length - 1; hour += 2) {
                    let hourData = {};

                    hourData.hour = data[day].hours[hour][0].split(":")[0] + ":00:00";
                    hourData.conso = (parseInt(data[day].hours[hour][1]) + parseInt(data[day].hours[hour + 1][1])) / 2;

                    hourData.price = (((hourData.conso / 1000) * abonnement.prixKwh) / 100);
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

