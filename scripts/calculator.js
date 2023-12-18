const abonnements = [];
var calculator = {
    getTarif: function (puissance, data, grille, jourZenPlus) {
        const monthsData = [];

        let abonnement = grille.prices.find((t) => t.puissance == puissance);
        if (abonnement) {
            let currentMonth = 0;
            let currentYear = 0;

            let monthData = {};
            for (let day = 0; day < data.length; day++) {
                let date = data[day].date.split("/");
                currentYear = parseInt(date[0]);

                if (date[1] != currentMonth) {
                    if (monthData.days) {
                        monthData.conso = monthData.days.reduce((a, b) => a + b.conso, 0);
                        monthData.price = monthData.days.reduce((a, b) => a + b.price, 0) + abonnement.abonnement;
                    }
                    currentMonth = date[1];
                    monthData = {};
                    monthData.month = currentMonth;
                    monthData.year = currentYear;
                    monthData.firstDayDate = new Date(currentYear, currentMonth, 1);
                    monthData.days = [];

                    monthsData.push(monthData);
                }

                let dayData = {
                    date: data[day].date,
                    hours: []
                };
                dayData.priceHC = 0;
                dayData.priceHP = 0;

                dayData.dayType = grille.getDayType(dayData, jourZenPlus);

                for (let hour = 0; hour < data[day].hours.length - 1; hour += 2) {
                    let hourData = {};

                    hourData.hour = data[day].hours[hour][0].split(":")[0] + ":00:00";
                    hourData.conso = (parseInt(data[day].hours[hour][1]) + parseInt(data[day].hours[hour + 1][1])) / 2;

                    let currentHour = parseInt(data[day].hours[hour][0].split(":")[0]);

                    if (grille.hc.some(range => currentHour >= range.start && currentHour < range.end)) {
                        let prixKwhHC = abonnement[dayData.dayType].prixKwhHC;

                        hourData.type = dayData.dayType + " HC";
                        hourData.price = (((hourData.conso / 1000) * prixKwhHC) / 100);
                        dayData.priceHC += hourData.price;
                    }
                    else {
                        let prixKwhHP = abonnement[dayData.dayType].prixKwhHP;
                        hourData.type = dayData.dayType + " HP";

                        hourData.price = (((hourData.conso / 1000) * prixKwhHP) / 100);
                        dayData.priceHP += hourData.price;
                    }
                    dayData.hours.push(hourData);
                }

                dayData.conso = dayData.hours.reduce((a, b) => a + b.conso, 0);
                dayData.price = dayData.hours.reduce((a, b) => a + b.price, 0);
                monthData.days.push(dayData);
            }
            monthData.conso = monthData.days.filter(d => !isNaN(d.conso)).reduce((a, b) => a + b.conso, 0);
            monthData.price = monthData.days.filter(d => !isNaN(d.price)).reduce((a, b) => a + b.price, 0) + abonnement.abonnement;
        }

        return monthsData;
    },
    calculateTarifForPeriod: function (monthsData, dateBegin, dateEnd) {
        let tarifForPeriod = {
            conso: 0,
            price: 0,
            months: []
        };

        //Take all months between dateBegin and dateEnd
        let months = monthsData.filter(m => m.firstDayDate >= dateBegin && m.firstDayDate <= dateEnd);

        tarifForPeriod.conso = months.filter(m => !isNaN(m.conso)).reduce((a, b) => a + b.conso, 0);
        tarifForPeriod.price = months.filter(m => !isNaN(m.price)).reduce((a, b) => a + b.price, 0);
        tarifForPeriod.months = months;

        return tarifForPeriod;
    }
}