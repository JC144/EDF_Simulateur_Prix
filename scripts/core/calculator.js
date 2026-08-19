// Moteur de calcul des coûts mensuels.
//
// Conventions d'unités (héritées des parsers et des grilles) :
// - consommations (conso, consoHC, consoHP) : Wh ;
// - prix du kWh dans les grilles : centimes d'euro ;
// - prix calculés (price, priceHC, priceHP, aboPriceByDay) : euros.
// Convention minuit : les parsers rattachent le relevé de 00:00 à la journée
// précédente sous l'heure 24 ; pour le classement HP/HC, minuit vaut 24
// (fin de plage incluse). Voir hcHourOf.
//
// Le calculateur consomme une vue résolue étroite construite par simulation.js :
// - plan : ligne tarifaire de la puissance souscrite
//   ({ abonnement, <type>: { prixKwhHP?, prixKwhHC } }) ;
// - getDayType(day, time) : type de jour, réglages utilisateur déjà appliqués ;
// - hcRangesFor(dayType) : plages d'heures creuses applicables à ce type ;
// - spotPricesFor(date) : optionnel (tarifs spot) — prix du kWh par pas spot
//   du jour en centimes (24 ou 96 valeurs), ou null si date sans données.

export function computeMonths({ plan, getDayType, hcRangesFor, spotPricesFor }, days) {
    const monthsData = [];
    if (!plan) {
        return monthsData;
    }

    let currentMonth = null;
    let monthData = null;
    for (const day of days) {
        const [year, month] = day.date.split("/");
        if (month !== currentMonth) {
            if (monthData) {
                sumMonthData(monthData);
            }
            currentMonth = month;
            monthData = startMonth(parseInt(year), month, plan);
            monthsData.push(monthData);
        }
        monthData.days.push(computeDay(day, monthData.aboPriceByDay, plan, getDayType, hcRangesFor, spotPricesFor));
    }
    if (monthData) {
        sumMonthData(monthData);
    }
    return monthsData;
}

// Agrège une liste de mois calculés sur une période (bornes incluses),
// en excluant les mois en erreur (NaN).
export function sumPeriod(monthsData, dateBegin, dateEnd) {
    const months = monthsData.filter(m => m.firstDayDate >= dateBegin && m.firstDayDate <= dateEnd);
    return {
        conso: months.filter(m => !isNaN(m.conso)).reduce((a, b) => a + b.conso, 0),
        price: months.filter(m => !isNaN(m.price)).reduce((a, b) => a + b.price, 0),
        months: months
    };
}

function startMonth(year, month, plan) {
    const numberOfDaysInMonth = new Date(year, +month, 0).getDate();
    return {
        month: month,
        year: year,
        firstDayDate: new Date(year, +month - 1, 1),
        days: [],
        hasErrors: false,
        numberOfDaysInMonth: numberOfDaysInMonth,
        // L'abonnement mensuel est réparti sur chaque jour du mois.
        aboPriceByDay: plan.abonnement / numberOfDaysInMonth
    };
}

function computeDay(day, aboPriceByDay, plan, getDayType, hcRangesFor, spotPricesFor) {
    const dayData = {
        date: day.date,
        hours: [],
        consoHC: 0,
        priceHC: 0,
        consoHP: 0,
        priceHP: 0
    };

    // Pas de consommation : 48 relevés = demi-heure, 96 = quart d'heure, etc.
    // Moins de 24 relevés (step 0) : journée faussée, marquée en erreur.
    const step = Math.floor(day.hours.length / 24);
    if (step === 0) {
        dayData.conso = NaN;
        dayData.price = NaN;
        return dayData;
    }

    // Tarif spot sans données pour ce jour (avant 2023, trou, jour trop
    // récent) : jour en erreur pour ce tarif seulement — les autres tarifs
    // ont leur propre computeMonths.
    const slotPrices = spotPricesFor ? spotPricesFor(day.date) : null;
    if (spotPricesFor && !slotPrices) {
        dayData.conso = NaN;
        dayData.price = NaN;
        return dayData;
    }

    // L'export EDF liste les relevés du plus récent au plus ancien : on trie
    // avant construction, l'ordre de dayData.hours portant le graphe horaire.
    const sortedHours = [...day.hours].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);

    for (const [timeLabel, rawValue] of sortedHours) {
        const [hour, minute] = timeLabel.split(":");
        const hourData = {
            time: { hour: parseInt(hour), minute: parseInt(minute) },
            conso: parseInt(rawValue) / step
        };
        if (isNaN(hourData.conso)) {
            hourData.hasErrors = true;
        }

        const dayType = getDayType(dayData, hourData.time);
        const hc = hcRangesFor(dayType).some(range => isHC(hcHourOf(hourData.time), range));
        const prixKwh = slotPrices
            ? spotPrixKwh(slotPrices, hourData.time, step)
            : (hc ? plan[dayType].prixKwhHC : plan[dayType].prixKwhHP);

        hourData.type = dayType + (hc ? " HC" : " HP");
        hourData.price = centimesToEuros(whToKwh(hourData.conso) * prixKwh);
        if (!isNaN(hourData.price)) {
            dayData[hc ? "priceHC" : "priceHP"] += hourData.price;
        }
        if (!isNaN(hourData.conso)) {
            dayData[hc ? "consoHC" : "consoHP"] += hourData.conso;
        }
        dayData.hours.push(hourData);
    }

    dayData.conso = dayData.hours.filter(h => !isNaN(h.conso)).reduce((a, b) => a + b.conso, 0);
    dayData.price = dayData.hours.filter(h => !isNaN(h.price)).reduce((a, b) => a + b.price, 0) + aboPriceByDay;
    return dayData;
}

function sumMonthData(monthData) {
    monthData.conso = monthData.days.filter(d => !isNaN(d.conso)).reduce((a, b) => a + b.conso, 0);
    monthData.price = monthData.days.filter(d => !isNaN(d.price)).reduce((a, b) => a + b.price, 0);
    const diffNumberOfDays = monthData.numberOfDaysInMonth - monthData.days.length;
    if (diffNumberOfDays > 0) {
        // Mois incomplet : marqué en erreur, mais l'abonnement des jours
        // manquants reste dû.
        monthData.hasErrors = true;
        monthData.price += diffNumberOfDays * monthData.aboPriceByDay;
    }
}

// Prix spot du créneau de conso : moyenne des pas spot couverts par
// l'intervalle du relevé. Un relevé étiqueté T couvre ]T - 60/step ; T] (même
// convention que le classement HP/HC : minuit = fin de journée, heure 24).
// Calcul en minutes — ne pas réutiliser hcHourOf, qui ignore les minutes
// 15/45 des relevés quart-horaires. Les grilles 60/30/15 min s'alignent
// toutes sur les pas spot de 60 min (24 valeurs) ou 15 min (96 valeurs).
function spotPrixKwh(slotPrices, time, step) {
    const mEnd = (time.hour === 24 || (time.hour === 0 && time.minute === 0))
        ? 1440
        : time.hour * 60 + time.minute;
    const mStart = mEnd - 60 / step;
    const slotMin = 1440 / slotPrices.length;
    let sum = 0;
    let count = 0;
    for (let i = Math.floor(mStart / slotMin); i < Math.ceil(mEnd / slotMin); i++) {
        sum += slotPrices[i];
        count++;
    }
    return sum / count;
}

// Heure scalaire pour le classement HP/HC : minuit (00:00 ou 24:00) vaut 24,
// les demi-heures comptent 0,5.
function hcHourOf(time) {
    const hour = time.hour === 24 ? 0 : time.hour;
    if (hour === 0 && time.minute === 0) {
        return 24;
    }
    return hour + (time.minute === 30 ? 0.5 : 0);
}

// Une plage HC exclut sa borne de début et inclut sa borne de fin.
function isHC(hcHour, range) {
    const begin = range.start.hour + (range.start.minute === 30 ? 0.5 : 0);
    const end = range.end.hour + (range.end.minute === 30 ? 0.5 : 0);
    return hcHour > begin && hcHour <= end;
}

function whToKwh(wh) {
    return wh / 1000;
}

function centimesToEuros(centimes) {
    return centimes / 100;
}
