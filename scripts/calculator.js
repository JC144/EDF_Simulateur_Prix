const abonnements = [];
var calculator = {
    getTarif: function (puissance, data, grille) {
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
                        sumMonthData(monthData);
                    }
                    currentMonth = date[1];
                    monthData = {};
                    monthData.month = currentMonth;
                    monthData.year = currentYear;
                    monthData.firstDayDate = new Date(currentYear, +currentMonth - 1, 1);
                    monthData.days = [];
                    monthData.hasErrors = false;
                    monthData.numberOfDaysInMonth = new Date(currentYear, +currentMonth, 0).getDate();
                    monthData.aboPriceByDay = abonnement.abonnement / monthData.numberOfDaysInMonth;

                    monthsData.push(monthData);
                }


                let dayData = {
                    date: data[day].date,
                    hours: [],
                    _hours: {}
                };
                dayData.consoHC = 0;
                dayData.priceHC = 0;
                dayData.consoHP = 0;
                dayData.priceHP = 0;

                // pour une journée donnée, parcours la listes heures et consommations 
                data[day].hours.forEach((hourLine) => {
                    const step = Math.floor(data[day].hours.length / 24);
                    const shiftTime = 60 / step;
                    // fix décalage tranche horaire EDF 
                    // ex: 00:00:00 donne en vérité la consommation pour la tranche 23:00 -> 00:00
                    let hourPart = getShiftedHour(hourLine, shiftTime);
                    let hourData = getHourData(dayData, hourPart);
                    hourData.conso += parseInt(hourLine[1]);
                    hourData.step += 1;

                    dayData._hours[hourPart] = hourData
                });

                // pour éviter des erreurs de décimal, on effectue la conversion une fois toute la journée traitée

                Object.values(dayData._hours).forEach(hourData => {
                    const dayType = grille.getDayType(dayData, hourData);

                    // consolidation consommations
                    hourData.conso = hourData.conso / hourData.step

                    if (grille.hc.some(range => hourData.hour >= range.start && hourData.hour < range.end)) {
                        hourData.type = dayType + " HC";
                        prixKwh = abonnement[dayType].prixKwhHC;
                        hourData.price = (((hourData.conso / 1000) * prixKwh) / 100);
                        dayData.consoHC += hourData.conso;
                        dayData.priceHC += hourData.price;
                    }
                    else {
                        hourData.type = dayType + " HP";
                        prixKwh = abonnement[dayType].prixKwhHP;
                        hourData.price = (((hourData.conso / 1000) * prixKwh) / 100);
                        dayData.consoHP += hourData.conso;
                        dayData.priceHP += hourData.price;
                    }

                    dayData.hours.push(hourData);
                });

                dayData._hours = null;

                dayData.conso = dayData.hours.reduce((a, b) => a + b.conso, 0);
                dayData.price = dayData.hours.reduce((a, b) => a + b.price, 0) + monthData.aboPriceByDay;
                monthData.days.push(dayData);
            }

            sumMonthData(monthData);
        }

        return monthsData;
    },

    calculateTarifForPeriod: function (monthsData, dateBegin, dateEnd) {
        let tarifForPeriod = {
            conso: 0,
            price: 0,
            months: []
        };

        //On prend tous les mois entre la date de début et de fin
        let months = monthsData.filter(m => m.firstDayDate >= dateBegin && m.firstDayDate <= dateEnd);

        tarifForPeriod.conso = months.filter(m => !isNaN(m.conso)).reduce((a, b) => a + b.conso, 0);
        tarifForPeriod.price = months.filter(m => !isNaN(m.price)).reduce((a, b) => a + b.price, 0);
        tarifForPeriod.months = months;

        return tarifForPeriod;
    }
}

function sumMonthData(monthData) {
    monthData.conso = monthData.days.filter(d => !isNaN(d.conso)).reduce((a, b) => a + b.conso, 0);
    monthData.price = monthData.days.filter(d => !isNaN(d.price)).reduce((a, b) => a + b.price, 0);
    const diffNumberOfDays = monthData.numberOfDaysInMonth - monthData.days.length;
    if (diffNumberOfDays > 0) {
        monthData.hasErrors = true;
        monthData.price += diffNumberOfDays * monthData.aboPriceByDay;
    }
}

function getShiftedHour(hourLine, shiftTime) {
    const shift = shiftTime || 0;

    // get hour of line
    const hour = hourLine[0]

    // convert it to real time (allow to substract minutes)
    const time = new Date("1970-01-01T" + hour);

    let shiftedTime = new Date(time - shift * 60000);

    return parseInt(shiftedTime.getHours());
}

function getHourData(dayData, hourKey) {

    if (!dayData._hours[hourKey]) {
        dayData._hours[hourKey] = {
            hour: hourKey,
            conso: 0,
            step: 0
        }
    }

    return dayData._hours[hourKey];
}