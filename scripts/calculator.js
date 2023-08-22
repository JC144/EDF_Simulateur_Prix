const abonnements = [];
var calculator = {
    getTarif: function (puissance, data, grille) {
        const yearsData = [];

        grille.specialDays.forEach((t) => {
            t.numberOfDaysLeft = t.numberOfDays;
        });

        let abonnement = grille.prices.find((t) => t.puissance == puissance);
        if (abonnement) {
            let currentMonth = 0;
            let currentYear = 0;

            let monthData = {};
            for (let day = 0; day < data.length; day++) {
                let date = data[day].date.split("/");
                currentYear = date[0];

                if (date[1] != currentMonth) {
                    if (monthData.days) {
                        monthData.conso = monthData.days.reduce((a, b) => a + b.conso, 0);
                        monthData.price = monthData.days.reduce((a, b) => a + b.price, 0) + abonnement.abonnement;
                    }
                    currentMonth = date[1];
                    monthData = {};
                    monthData.month = date[1];
                    monthData.days = [];

                    let yearData = {
                        year: 0,
                        months: []
                    };
                    if (currentMonth < 3) {
                        if (yearsData.some((y) => y.year == currentYear - 1)) {
                            yearData = yearsData.find((y) => y.year == currentYear - 1);
                        }
                        else {
                            yearData.year = currentYear - 1;
                            yearsData.push(yearData);
                        }
                    }
                    else {
                        if (yearsData.some((y) => y.year == currentYear)) {
                            yearData = yearsData.find((y) => y.year == currentYear);
                        }
                        else {
                            yearData.year = currentYear;
                            yearsData.push(yearData);
                        }
                    }

                    yearData.months.push(monthData);
                }

                let dayData = {
                    date: data[day].date,
                    hours: []
                };
                dayData.priceHC = 0;
                dayData.priceHP = 0;

                dayData.dayType = this.getDayType(dayData, grille.specialDays);

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
            yearsData.forEach((y) => {
                y.conso = y.months.filter(m => !isNaN(m.conso)).reduce((a, b) => a + b.conso, 0);
                y.price = y.months.filter(m => !isNaN(m.price)).reduce((a, b) => a + b.price, 0);
            });
        }

        return yearsData;
    },
    getDayType: function (day, specialDays) {
        let dayType = "bleu";

        specialDays.forEach((specialDay) => {
            if (specialDay.lastDays.includes(day.date)) {
                dayType = specialDay.name;
            }
        });

        return dayType;
    }
}