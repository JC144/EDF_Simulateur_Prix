var tarifTempo = {
    prices: [
        {
            puissance: 6,
            abonnement: 12.28,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        },
        {
            puissance: 9,
            abonnement: 15.33,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        },
        {
            puissance: 12,
            abonnement: 18.78,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        },
        {
            puissance: 15,
            abonnement: 21.27,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        },
        {
            puissance: 18,
            abonnement: 23.98,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        },
        {
            puissance: 30,
            abonnement: 36.06,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        },
        {
            puissance: 36,
            abonnement: 41.90,
            bleu: {
                prixKwhHP: 12.49,
                prixKwhHC: 9.70
            },
            blanc: {
                prixKwhHP: 15.08,
                prixKwhHC: 11.40
            },
            rouge: {
                prixKwhHP: 67.12,
                prixKwhHC: 12.16
            }
        }],
    hc: {
        start: 22,
        end: 6
    },
    hp: {
        start: 6,
        end: 22
    },
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

                dayData.color = getDayColor(dayData);

                for (let hour = 0; hour < data[day].hours.length - 1; hour += 2) {
                    let hourData = {};

                    hourData.hour = data[day].hours[hour][0].split(":")[0] + ":00:00";
                    hourData.conso = (parseInt(data[day].hours[hour][1]) + parseInt(data[day].hours[hour + 1][1])) / 2;

                    let currentHour = parseInt(data[day].hours[hour][0].split(":")[0]);
                    if (currentHour >= this.hc.start || currentHour <= this.hc.end) {
                        let prixKwhHC = 0;
                        if (dayData.color == "red") {
                            prixKwhHP = abonnement.rouge.prixKwhHC;
                        }
                        else if (dayData.color == "white") {
                            prixKwhHP = abonnement.blanc.prixKwhHC;
                        }
                        else {
                            prixKwhHP = abonnement.bleu.prixKwhHC;
                        }
                        hourData.price = (((hourData.conso / 1000) * parseInt(prixKwhHC)) / 100);
                    }
                    else {
                        let prixKwhHP = 0;
                        if (dayData.color == "red") {
                            prixKwhHP = abonnement.rouge.prixKwhHP;
                        }
                        else if (dayData.color == "white") {
                            prixKwhHP = abonnement.blanc.prixKwhHP;
                        }
                        else {
                            prixKwhHP = abonnement.bleu.prixKwhHP;
                        }
                        hourData.price = (((hourData.conso / 1000) * parseInt(prixKwhHP)) / 100);
                    }

                    dayData.conso = dayData.hours.reduce((a, b) => a + b.conso, 0);
                    dayData.price = dayData.hours.reduce((a, b) => a + b.price, 0);
                    dayData.hours.push(hourData);
                }
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

function getDayColor(day) {
    let month = parseInt(day.date.split("/")[1]);
    let color = "bleu";
    if (tarifTempo.redDays.numberOfDaysLeft > 0 && (month >= tarifTempo.redDays.monthBegin || month <= tarifTempo.redDays.monthEnd)) {
        if (Math.random() < calculateRiskForADay(tarifTempo.redDays.monthEnd, tarifTempo.redDays.monthBegin, tarifTempo.redDays.numberOfDays)) {
            color = "red";
            tarifTempo.redDays.numberOfDaysLeft--;
        }
    }
    if (tarifTempo.whiteDays.numberOfDaysLeft > 0 && color != "red" && (month >= tarifTempo.whiteDays.monthBegin || month <= tarifTempo.whiteDays.monthEnd)) {
        if (Math.random() < calculateRiskForADay(tarifTempo.whiteDays.monthEnd, tarifTempo.whiteDays.monthBegin, tarifTempo.whiteDays.numberOfDays)) {
            color = "white";
            tarifTempo.whiteDays.numberOfDaysLeft--;
        }
    }
    return color;
}

function calculateRiskForADay(monthEnd, monthBegin, numberOfDays) {
    let riskOfDay = 0;
    if (monthBegin > monthEnd) {
        riskOfDay = (((12 - monthBegin) + monthBegin) * 30.5) / numberOfDays;
    }
    else {
        riskOfDay = ((monthEnd - monthBegin) * 30.5) / numberOfDays;
    }
    return riskOfDay;
}