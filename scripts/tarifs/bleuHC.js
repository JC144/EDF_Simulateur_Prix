var tarifBleuHC = {
    prices: [
        {
            puissance: 6,
            abonnement: 12.85,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 9,
            abonnement: 16.55,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 12,
            abonnement: 19.97,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 15,
            abonnement: 23.24,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 18,
            abonnement: 26.48,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 24,
            abonnement: 33.28,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 30,
            abonnement: 39.46,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
        },
        {
            puissance: 36,
            abonnement: 44.64,
            prixKwhHP: 24.60,
            prixKwhHC: 18.28
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
                dayData.priceHC = 0;
                dayData.priceHP = 0;

                for (let hour = 0; hour < data[day].hours.length - 1; hour += 2) {
                    let hourData = {};

                    hourData.hour = data[day].hours[hour][0].split(":")[0] + ":00:00";
                    hourData.conso = (parseInt(data[day].hours[hour][1]) + parseInt(data[day].hours[hour + 1][1])) / 2;

                    let currentHour = parseInt(data[day].hours[hour][0].split(":")[0]);
                    if (currentHour >= this.hc.start || currentHour <= this.hc.end) {
                        hourData.price = (((hourData.conso / 1000) * abonnement.prixKwhHC) / 100);
                        dayData.priceHC += hourData.price;
                        hourData.type = "HC";
                    }
                    else {
                        hourData.price = (((hourData.conso / 1000) * abonnement.prixKwhHP) / 100);
                        dayData.priceHP += hourData.price;
                        hourData.type = "HP";
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