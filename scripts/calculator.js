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
                    hours: []
                };
                dayData.consoHC = 0;
                dayData.priceHC = 0;
                dayData.consoHP = 0;
                dayData.priceHP = 0;

                //On définit le pas de consommation pour chaque jour.
                //Si on a 48 valeurs, on est à la demi-heure, 96 pour le quart d'heure, etc...
                const step = Math.floor(data[day].hours.length / 24);

                //Si on a un pas de 0 on a sûrement moins de 24 tranches de remontées
                //La journée sera faussée, on la marque en erreur
                if (step == 0) {
                    dayData.conso = NaN;
                    dayData.price = NaN;
                }
                else {
                    // pour une journée donnée, parcours la listes heures et consommations 
                    data[day].hours.forEach((hourLine) => {

                        const splittedHour = hourLine[0].split(":");

                        let hourData = {
                            time: { hour: parseInt(splittedHour[0]), minute: parseInt(splittedHour[1]) },
                            conso: parseInt(hourLine[1]) / step
                        };
                        if (isNaN(hourData.conso)) {
                            hourData.hasErrors = true;
                        }

                        const dayType = grille.getDayType(dayData, hourData.time);
                        // 00:00:00 est converti en 24:00:00 pour le calcul du type de jour
                        // On reconverti à une heure réelle pour le calcul des HC/HP
                        const realHour = hourData.time.hour == 24 ? 0 : hourData.time.hour;
                        const realTime = { hour: realHour, minute: hourData.time.minute };
                        if (grille.hc.some(range => isHC(realTime, range.start, range.end))) {
                            hourData.type = dayType + " HC";
                            const prixKwh = abonnement[dayType].prixKwhHC;
                            hourData.price = (((hourData.conso / 1000) * prixKwh) / 100);
                            if (!isNaN(hourData.price)) {
                                dayData.priceHC += hourData.price;
                            }
                            if (!isNaN(hourData.conso)) {
                                dayData.consoHC += hourData.conso;
                            }
                        }
                        else {
                            hourData.type = dayType + " HP";
                            const prixKwh = abonnement[dayType].prixKwhHP;
                            hourData.price = (((hourData.conso / 1000) * prixKwh) / 100);
                            if (!isNaN(hourData.price)) {
                                dayData.priceHP += hourData.price;
                            }
                            if (!isNaN(hourData.conso)) {
                                dayData.consoHP += hourData.conso;
                            }
                        }

                        dayData.hours.push(hourData);
                    });

                    dayData.conso = dayData.hours.filter(m => !isNaN(m.conso)).reduce((a, b) => a + b.conso, 0);
                    dayData.price = dayData.hours.filter(m => !isNaN(m.price)).reduce((a, b) => a + b.price, 0) + monthData.aboPriceByDay;
                }
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

function isHC(timeInformation, hcTimeBegin, hcTimeEnd) {
  begin = hcTimeBegin.hour + (hcTimeBegin.minute === 30 ? 0.5 : 0);
  end = hcTimeEnd.hour + (hcTimeEnd.minute === 30 ? 0.5 : 0);
  time = timeInformation.hour + (timeInformation.minute === 30 ? 0.5 : 0);

  if (timeInformation.hour === 0 && timeInformation.minute === 0) {
    time = 24;
  }

  const isHC = time > begin && time <= end;

  return isHC;
}