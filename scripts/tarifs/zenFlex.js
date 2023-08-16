var tarifZenFlex = {
    prices: [
        {
            puissance: 6,
            abonnement: 12.62,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 9,
            abonnement: 15.99,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 12,
            abonnement: 19.27,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 15,
            abonnement: 22.40,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 18,
            abonnement: 25.46,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 24,
            abonnement: 32.01,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 30,
            abonnement: 38.07,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        },
        {
            puissance: 36,
            abonnement: 43.88,
            eco: {
                prixKwhHP: 22.28,
                prixKwhHC: 12.95
            },
            sobriete: {
                prixKwhHP: 67.12,
                prixKwhHC: 22.28
            }
        }],
    hc: [{
        start: 0,
        end: 8
    },
    {
        start: 13,
        end: 18
    },
    {
        start: 20,
        end: 24
    }],
    sobrieteDays: {
        numberOfDays: 20,
        monthBegin: 10,
        monthEnd: 4
    },
    getTarif: function (puissance, data) {
        this.sobrieteDays.numberOfDaysLeft = this.sobrieteDays.numberOfDays;

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

                dayData.color = this.getDayColor(dayData);

                for (let hour = 0; hour < data[day].hours.length - 1; hour += 2) {
                    let hourData = {};

                    hourData.hour = data[day].hours[hour][0].split(":")[0] + ":00:00";
                    hourData.conso = (parseInt(data[day].hours[hour][1]) + parseInt(data[day].hours[hour + 1][1])) / 2;

                    let currentHour = parseInt(data[day].hours[hour][0].split(":")[0]);
                    if (this.hc.some(range => currentHour >= range.start && currentHour < range.end)) {
                        let prixKwhHC = 0;
                        if (dayData.color == "sobriete") {
                            prixKwhHC = abonnement.sobriete.prixKwhHC;
                            hourData.type = "sobriete HC";
                        }
                        else {
                            prixKwhHC = abonnement.eco.prixKwhHC;
                            hourData.type = "eco HC";
                        }
                        hourData.price = (((hourData.conso / 1000) * prixKwhHC) / 100);                        
                        dayData.priceHC += hourData.price;
                    }
                    else {
                        let prixKwhHP = 0;
                        if (dayData.color == "sobriete") {
                            prixKwhHP = abonnement.sobriete.prixKwhHP;
                            hourData.type = "sobriete HP";
                        }
                        else {
                            prixKwhHP = abonnement.eco.prixKwhHP;
                            hourData.type = "eco HP";
                        }
                        hourData.price = (((hourData.conso / 1000) * prixKwhHP) / 100);                        
                        dayData.priceHP += hourData.price;
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
    },
    getDayColor: function (day) {
        let month = parseInt(day.date.split("/")[1]);
        let color = "eco";
        if (tarifZenFlex.sobrieteDays.numberOfDaysLeft > 0 && (month >= tarifZenFlex.sobrieteDays.monthBegin || month <= tarifZenFlex.sobrieteDays.monthEnd)) {
            if (Math.random() < this.calculateRiskForADay(tarifZenFlex.sobrieteDays.monthEnd, tarifZenFlex.sobrieteDays.monthBegin, tarifZenFlex.sobrieteDays.numberOfDays)) {
                color = "sobriete";
                tarifZenFlex.sobrieteDays.numberOfDaysLeft--;
            }
        }
        return color;
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