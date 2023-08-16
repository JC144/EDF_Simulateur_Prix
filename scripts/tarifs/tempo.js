var tarifTempo = {
    prices: [
        {
            puissance: 6,
            abonnement: 12.80,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        },
        {
            puissance: 9,
            abonnement: 16.00,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        },
        {
            puissance: 12,
            abonnement: 19.29,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        },
        {
            puissance: 15,
            abonnement: 22.30,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        },
        {
            puissance: 18,
            abonnement: 25.29,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        },
        {
            puissance: 30,
            abonnement: 38.13,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        },
        {
            puissance: 36,
            abonnement: 44.28,
            bleu: {
                prixKwhHP: 13.69,
                prixKwhHC: 10.56
            },
            blanc: {
                prixKwhHP: 16.54,
                prixKwhHC: 12.46
            },
            rouge: {
                prixKwhHP: 73.24,
                prixKwhHC: 13.28
            }
        }],
    hc: [{
        start: 22,
        end: 24
    },
    {
        start: 0,
        end: 6
    }],
    redDays: {
        numberOfDays: 22,
        monthBegin: 11,
        monthEnd: 3
    },
    whiteDays: {
        numberOfDays: 43,
        monthBegin: 10,
        monthEnd: 6
    },
    getTarif: function (puissance, data) {
        this.redDays.numberOfDaysLeft = this.redDays.numberOfDays;
        this.whiteDays.numberOfDaysLeft = this.whiteDays.numberOfDays;

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
                        if (dayData.color == "red") {
                            prixKwhHC = abonnement.rouge.prixKwhHC;
                            hourData.type = "red HC";
                        }
                        else if (dayData.color == "white") {
                            prixKwhHC = abonnement.blanc.prixKwhHC;
                            hourData.type = "white HC";
                        }
                        else {
                            prixKwhHC = abonnement.bleu.prixKwhHC;
                            hourData.type = "bleu HC";
                        }
                        hourData.price = (((hourData.conso / 1000) * prixKwhHC) / 100);                        
                        dayData.priceHC += hourData.price;
                    }
                    else {
                        let prixKwhHP = 0;
                        if (dayData.color == "red") {
                            prixKwhHP = abonnement.rouge.prixKwhHP;
                            hourData.type = "red HP";
                        }
                        else if (dayData.color == "white") {
                            prixKwhHP = abonnement.blanc.prixKwhHP;
                            hourData.type = "white HP";
                        }
                        else {
                            prixKwhHP = abonnement.bleu.prixKwhHP;
                            hourData.type = "bleu HP";
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
        let color = "bleu";
        if (tarifTempo.redDays.numberOfDaysLeft > 0 && (month >= tarifTempo.redDays.monthBegin || month <= tarifTempo.redDays.monthEnd)) {
            if (Math.random() < this.calculateRiskForADay(tarifTempo.redDays.monthEnd, tarifTempo.redDays.monthBegin, tarifTempo.redDays.numberOfDays)) {
                color = "red";
                tarifTempo.redDays.numberOfDaysLeft--;
            }
        }
        if (tarifTempo.whiteDays.numberOfDaysLeft > 0 && color != "red" && (month >= tarifTempo.whiteDays.monthBegin || month <= tarifTempo.whiteDays.monthEnd)) {
            if (Math.random() < this.calculateRiskForADay(tarifTempo.whiteDays.monthEnd, tarifTempo.whiteDays.monthBegin, tarifTempo.whiteDays.numberOfDays)) {
                color = "white";
                tarifTempo.whiteDays.numberOfDaysLeft--;
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