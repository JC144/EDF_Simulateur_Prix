var calculator = {
    getTarif: function (puissance, data, grille) {
        let yearData = {
            months: [],
            price: 0
        };

        grille.specialDays.forEach((t) => {
            t.numberOfDaysLeft = t.numberOfDays;
        });

        let abonnement = grille.prices.find((t) => t.puissance == puissance);
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
            yearData.conso = yearData.months.filter(m => !isNaN(m.conso)).reduce((a, b) => a + b.conso, 0);
            yearData.price = yearData.months.filter(m => !isNaN(m.price)).reduce((a, b) => a + b.price, 0);
        }

        return yearData;
    },
    getDayType: function (day, specialDays) {
        let month = parseInt(day.date.split("/")[1]);
        let dayType = "bleu";

        if (specialDays.length > 0) {
            specialDays.forEach((specialDay) => {
                if (specialDay.numberOfDaysLeft > 0 && (month >= specialDay.monthBegin || month <= specialDay.monthEnd)) {
                    if (Math.random() < this.calculateRiskForADay(specialDay.monthEnd, specialDay.monthBegin, specialDay.numberOfDays)) {
                        dayName = specialDay.name;
                        specialDay.numberOfDaysLeft--;
                    }
                }
            });
        }

        return dayType;
    },
    calculateRiskForADay: function (monthEnd, monthBegin, numberOfDays) {
        let riskOfDay = 0;
        if (monthBegin > monthEnd) {
            riskOfDay = (((12 - monthBegin) + monthBegin) * 30.5) / numberOfDays;
        }
        else {
            riskOfDay = ((monthEnd - monthBegin) * 30.5) / numberOfDays;
        }
        return riskOfDay;
    }
}