viewManager.init();

var data = [];
let calculatedMonths = {};

let beginYear = 0;
let beginMonth = 0;
let endYear = 0;
let endMonth = 0;
let yearsAvailable = [];

const formImport = document.getElementById("formImport");
const csvFile = document.getElementById("csvFile");
const kvaSelector = document.getElementById("puissanceSouscrite");
const jourZenPlusSelector = document.getElementById("jourZenPlus");
const simulateButton = document.getElementById("simulateButton");
const importError = document.getElementById("importError");

const yearBeginSelector = document.getElementById("yearBeginSelector");
yearBeginSelector.addEventListener("change", yearBeginSelectorChanged);

const monthBeginSelector = document.getElementById("monthBeginSelector");
monthBeginSelector.addEventListener("change", monthBeginSelectorChanged);

const yearEndSelector = document.getElementById("yearEndSelector");
yearEndSelector.addEventListener("change", yearEndSelectorChanged);

const monthEndSelector = document.getElementById("monthEndSelector");
monthEndSelector.addEventListener("change", monthEndSelectorChanged);

const refreshButton = document.getElementById("refreshButton");
refreshButton.addEventListener("click", function () {
    let dateBegin = new Date(beginYear, beginMonth - 1, 1);
    let dateEnd = new Date(endYear, endMonth - 1, 1);
    refreshResultView(dateBegin, dateEnd);
});

const bleuHCStartEndDay1 = document.getElementById("bleuHC-start-endDay1");
const bleuHCEndEndDay1 = document.getElementById("bleuHC-end-endDay1");
const bleuHCStartBeginDay2 = document.getElementById("bleuHC-start-beginDay2");
const bleuHCEndBeginDay2 = document.getElementById("bleuHC-end-beginDay2");
const bleuHCStartMiddleDay2 = document.getElementById("bleuHC-start-middleDay2");
const bleuHCEndMiddleDay2 = document.getElementById("bleuHC-end-middleDay2");
bleuHCStartEndDay1.addEventListener("change", bleuHCRangeChanged);
bleuHCEndEndDay1.addEventListener("change", bleuHCRangeChanged);
bleuHCStartBeginDay2.addEventListener("change", bleuHCRangeChanged);
bleuHCEndBeginDay2.addEventListener("change", bleuHCRangeChanged);
bleuHCStartMiddleDay2.addEventListener("change", bleuHCRangeChanged);
bleuHCEndMiddleDay2.addEventListener("change", bleuHCRangeChanged);

csvFile.addEventListener("change", onFileImported);
importError.style.display = "none";

document.getElementById("startButton").onclick = function () { viewManager.displayNextView(); };
document.getElementById("simulateButton").onclick = function () {
    displayResults();
};

function bleuHCRangeChanged(e) {
    //If it's a start, we need to check if the end is after the start
    if (e.target.id.includes("start")) {
        const end = document.getElementById(e.target.id.replace("start", "end"));
        const selectedTime = e.target.value.split(":");
        const selectedHours = parseInt(selectedTime[0]);
        const selectedMinutes = parseInt(selectedTime[1]);
        const endTime = end.value.split(":");
        const endHours = parseInt(endTime[0]);
        const endMinutes = parseInt(endTime[1]);
        if (selectedHours > endHours || (selectedHours == endHours && selectedMinutes > endMinutes)) {
            end.value = e.target.value;
        }
    }
    else if (e.target.id.includes("end")) {
        const start = document.getElementById(e.target.id.replace("end", "start"));
        const selectedTime = e.target.value.split(":");
        const selectedHours = parseInt(selectedTime[0]);
        const selectedMinutes = parseInt(selectedTime[1]);
        const startTime = start.value.split(":");
        const startHours = parseInt(startTime[0]);
        const startMinutes = parseInt(startTime[1]);
        if (selectedHours < startHours || (selectedHours == startHours && selectedMinutes < startMinutes)) {
            start.value = e.target.value;
        }
    }
}

function onFileImported(e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        importError.style.display = "none";

        var parser = edfParser;
        const text = e.target.result;

        const regexTotalEnergies = /^[0-9]{9}\-[A-Z]+\-[A-Z]+\.csv$/;

        if (csvFile.files[0].name.includes("Enedis")) {
            parser = enedisParser;
        } else if (csvFile.files[0].name.match(regexTotalEnergies)) {
            parser = totalParser;
        }
        try {
            let rawCSV = parser.parseCSV(text);
            data = parser.loadData(rawCSV);
            simulateButton.disabled = false;
        }
        catch (e) {
            importError.style.display = "block";
        }
    };
    reader.readAsText(input);
}

function calculateAllMonths(kva) {
    //On filtre sur les abonnements qui correspondent à la puissance souscrite
    calculatedMonths = abonnements.filter(a => a.prices.some(p => p.puissance == kva)).map(abo => {
        return {
            allMonths: calculator.getTarif(kva, data, abo),
            title: abo.name
        }
    });
    yearsAvailable = [...new Set(calculatedMonths[0].allMonths.map(m => m.year))].sort((a, b) => a - b);
}

function displayResults() {
    addCustomisationToAbonnements();
    calculateAllMonths(kvaSelector.value);

    setBeginYearSelector();
    setBeginMonthSelector();
    setEndYearSelector(yearsAvailable[yearsAvailable.length - 1]);
    setEndMonthSelector(endYear);

    let dateBegin = new Date(beginYear, beginMonth - 1, 1);
    let dateEnd = new Date(endYear, endMonth - 1, 1);

    viewManager.displayNextView();
    refreshResultView(dateBegin, dateEnd);
}

function addCustomisationToAbonnements() {
    abonnements.forEach((abo) => {
        if (abo.hasSpecialDaysCustom) {
            abo.specialDays.push(parseInt(jourZenPlusSelector.value));
        }
        if (abo.hasHCCustom) {
            abo.hc = getBleuHCRange();
        }
    });
}

function getBleuHCRange() {
    let rangeHC = [];

    const startEndDay1 = document.getElementById("bleuHC-start-endDay1").value;
    const endEndDay1 = document.getElementById("bleuHC-end-endDay1").value;

    const startBeginDay2 = document.getElementById("bleuHC-start-beginDay2").value;
    const endBeginDay2 = document.getElementById("bleuHC-end-beginDay2").value;

    const startMiddleDay2 = document.getElementById("bleuHC-start-middleDay2").value;
    const endMiddleDay2 = document.getElementById("bleuHC-end-middleDay2").value;

    const rangeEndDay1 = formatHCRange(startEndDay1, endEndDay1);
    const rangeBeginDay2 = formatHCRange(startBeginDay2, endBeginDay2);
    const rangeMiddleDay2 = formatHCRange(startMiddleDay2, endMiddleDay2);

    if (rangeEndDay1 != null) {
        rangeHC.push(rangeEndDay1);
    }
    if (rangeBeginDay2 != null) {
        rangeHC.push(rangeBeginDay2);
    }
    if (rangeMiddleDay2 != null) {
        rangeHC.push(rangeMiddleDay2);
    }
    return rangeHC;
}

function formatHCRange(rawStart, rawEnd) {
    const startTime = rawStart.split(":");
    let startHours = parseInt(startTime[0]);
    let startMinutes = parseInt(startTime[1]);
    const endTime = rawEnd.split(":");
    let endHours = parseInt(endTime[0]);
    let endMinutes = parseInt(endTime[1]);

    if (startMinutes > 30) {
        startHours++;
    }
    startMinutes = 0;

    //Permet de gérer le 23:59
    if (endMinutes > 30) {
        endHours++;
    }
    endMinutes = 0;

    if (startHours >= endHours) {
        return null;
    } else {
        return {
            start: { hour: startHours, minute: startMinutes },
            end: { hour: endHours, minute: endMinutes }
        }
    }
}

function refreshResultView(dateBegin, dateEnd) {
    pricesResultRow.innerHTML = "";

    const resultsForPeriod = calculatedMonths.map((t) => {
        return {
            tarif: calculator.calculateTarifForPeriod(t.allMonths, dateBegin, dateEnd),
            title: t.title
        }
    });

    const consoForPeriod = resultsForPeriod[0].tarif.conso;

    const divYear = document.createElement("div");
    divYear.className = "mb-4";
    pricesResultRow.appendChild(divYear);
    const titleYear = document.createElement("h3");
    divYear.appendChild(titleYear);
    titleYear.className = "main-title";
    const titleConso = document.createElement("h4");
    divYear.appendChild(titleConso);
    titleConso.className = "sub-title";

    titleConso.innerHTML = "Consommation : " + (consoForPeriod / 1000).toFixed(2) + "kWh";

    const table = document.createElement("table");
    table.className = "table mt-3";
    divYear.appendChild(table);
    const tableHeader = document.createElement("thead");
    table.appendChild(tableHeader);
    const rowHeader = document.createElement("tr");
    tableHeader.appendChild(rowHeader);
    const headerTarifName = document.createElement("th");
    headerTarifName.innerHTML = "Tarif";
    rowHeader.appendChild(headerTarifName);
    const headerEstimationName = document.createElement("th");
    headerEstimationName.innerHTML = "Estimation";
    headerEstimationName.className = "text-center";
    rowHeader.appendChild(headerEstimationName);
    const headerDifferenceName = document.createElement("th");
    headerDifferenceName.innerHTML = "Différence";
    headerDifferenceName.className = "text-center";
    rowHeader.appendChild(headerDifferenceName);

    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody);

    let currentRow = 0;
    const resultsOrdered = resultsForPeriod.map((r) => ({
        tarif: r.tarif,
        title: r.title
    }))
        .sort((a, b) => a.tarif.price - b.tarif.price);

    resultsOrdered.forEach(result => {
        const tarifRow = document.createElement("tr");
        const accordionRowId = dateBegin.getFullYear() + "-" + currentRow;
        tableBody.appendChild(tarifRow);
        tarifRow.setAttribute("data-bs-toggle", "collapse");
        tarifRow.setAttribute("data-bs-target", "#" + accordionRowId);

        const accordionRow = document.createElement("tr");
        tableBody.appendChild(accordionRow);
        accordionRow.id = accordionRowId;
        accordionRow.className = "collapse";

        const accordionCell = document.createElement("td");
        accordionCell.colSpan = 3;
        accordionRow.appendChild(accordionCell);

        result.tarif.months.forEach((m) => {
            const titleDetail = document.createElement("h3");
            accordionCell.appendChild(titleDetail);
            titleDetail.className = "main-title";
            const subTitleDetail = document.createElement("h4");
            accordionCell.appendChild(subTitleDetail);
            subTitleDetail.className = "sub-title";

            titleDetail.innerHTML = getMonthName(parseInt(m.month));
            subTitleDetail.innerHTML = (m.conso / 1000).toFixed(2) + "kWh / " + m.price.toFixed(2) + "€";

            const tableDailyDetail = document.createElement("table");
            tableDailyDetail.className = "table mt-2";
            accordionCell.appendChild(tableDailyDetail);
            const headerDailyDetail = document.createElement("tr");
            tableDailyDetail.appendChild(document.createElement("thead").appendChild(headerDailyDetail));
            const cell1HeaderDailyDetail = document.createElement("th");
            const cell2HeaderDailyDetail = document.createElement("th");
            const cell3HeaderDailyDetail = document.createElement("th");
            const cell4HeaderDailyDetail = document.createElement("th");
            const cell5HeaderDailyDetail = document.createElement("th");
            const cell6HeaderDailyDetail = document.createElement("th");
            const cell7HeaderDailyDetail = document.createElement("th");
            cell1HeaderDailyDetail.innerHTML = "Jour";
            cell2HeaderDailyDetail.innerHTML = "Consommation totale";
            cell3HeaderDailyDetail.innerHTML = "Conso HC (kWh)";
            cell4HeaderDailyDetail.innerHTML = "Estimation HC (€)";
            cell5HeaderDailyDetail.innerHTML = "Conso HP (kWh)";
            cell6HeaderDailyDetail.innerHTML = "Estimation HP (€)";
            cell7HeaderDailyDetail.innerHTML = "Total (€)";

            headerDailyDetail.appendChild(cell1HeaderDailyDetail);
            headerDailyDetail.appendChild(cell2HeaderDailyDetail);
            headerDailyDetail.appendChild(cell3HeaderDailyDetail);
            headerDailyDetail.appendChild(cell4HeaderDailyDetail);
            headerDailyDetail.appendChild(cell5HeaderDailyDetail);
            headerDailyDetail.appendChild(cell6HeaderDailyDetail);
            headerDailyDetail.appendChild(cell7HeaderDailyDetail);

            for (let j = m.days.length - 1; j >= 0; j--) {
                const bodyDailyDetail = document.createElement("tr");
                tableDailyDetail.appendChild(document.createElement("tbody").appendChild(bodyDailyDetail));

                const cell1BodyDailyDetail = document.createElement("td");
                cell1BodyDailyDetail.innerHTML = m.days[j].date;
                bodyDailyDetail.appendChild(cell1BodyDailyDetail);

                //S'il n'y a pas d'erreur lors du calcul de la journée, on affiche les informations
                if (!isNaN(m.days[j].conso) && !isNaN(m.days[j].price)) {
                    const cell2BodyDailyDetail = document.createElement("td");
                    const cell3BodyDailyDetail = document.createElement("td");
                    const cell4BodyDailyDetail = document.createElement("td");
                    const cell5BodyDailyDetail = document.createElement("td");
                    const cell6BodyDailyDetail = document.createElement("td");
                    const cell7BodyDailyDetail = document.createElement("td");

                    cell2BodyDailyDetail.innerHTML = (m.days[j].conso / 1000).toFixed(2) + "kWh";
                    cell3BodyDailyDetail.innerHTML = (m.days[j].consoHC / 1000).toFixed(2) + "kWh";
                    cell4BodyDailyDetail.innerHTML = m.days[j].priceHC.toFixed(2) + "€";
                    cell5BodyDailyDetail.innerHTML = (m.days[j].consoHP / 1000).toFixed(2) + "kWh";
                    cell6BodyDailyDetail.innerHTML = m.days[j].priceHP.toFixed(2) + "€";
                    cell7BodyDailyDetail.innerHTML = m.days[j].price.toFixed(2) + "€";
                    bodyDailyDetail.appendChild(cell2BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell3BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell4BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell5BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell6BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell7BodyDailyDetail);
                }
                else {
                    const cellError = document.createElement("td");
                    cellError.className = "text-center align-middle fw-bold";
                    cellError.colSpan = 7;
                    cellError.innerHTML = "Erreur lors du calcul de la journée";
                    bodyDailyDetail.appendChild(cellError);
                }
            }
        });

        const cellTarifName = document.createElement("th");
        cellTarifName.className = "align-middle";
        tarifRow.appendChild(cellTarifName);
        cellTarifName.innerHTML = result.title;

        const cellTarifPrice = document.createElement("td");
        cellTarifPrice.className = "text-center align-middle";
        tarifRow.appendChild(cellTarifPrice);
        cellTarifPrice.innerHTML = result.tarif.price.toFixed(2) + " € TTC <br>(" + (result.tarif.price / result.tarif.months.length).toFixed(2) + " €/mois)";

        const cellDiffencePrice = document.createElement("td");
        cellDiffencePrice.className = "text-center align-middle";
        tarifRow.appendChild(cellDiffencePrice);
        if (currentRow == 0) {
            const spanLessExpensive = document.createElement("span");
            spanLessExpensive.className = "fw-bold";
            spanLessExpensive.innerHTML = "Tarif le moins cher";
            cellDiffencePrice.appendChild(spanLessExpensive);
        }
        else {
            cellDiffencePrice.innerHTML = "+ " + (result.tarif.price - resultsOrdered[0].tarif.price).toFixed(2) + " € TTC <br>(" + ((result.tarif.price - resultsOrdered[0].tarif.price) / 12).toFixed(2) + " €/mois)";
        }
        currentRow++;
    });
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    let monthString = date.toLocaleString('fr-FR', { month: 'long' });
    return monthString.charAt(0).toUpperCase() + monthString.slice(1)
}

function setOptions(select, options, selectedValue) {
    select.innerHTML = "";
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.text = option.text;
        select.appendChild(optionElement);
    });
    select.value = selectedValue;
}

function setBeginYearSelector() {
    beginYear = yearsAvailable[0];
    setOptions(yearBeginSelector, yearsAvailable.map(y => { return { text: y, value: y } }), beginYear);
}

function setBeginMonthSelector() {
    let beginMonthsAvailable = calculatedMonths[0].allMonths.filter(m => m.year == beginYear).map(m => m.month).sort((a, b) => a - b);
    beginMonth = beginMonthsAvailable.find(m => (m.month == "11"));
    beginMonth = beginMonth ? beginMonth : beginMonthsAvailable[0];
    setOptions(monthBeginSelector, beginMonthsAvailable.map(m => { return { text: getMonthName(m), value: m } }), beginMonth);
}

function setEndYearSelector(year) {
    endYear = year;
    setOptions(yearEndSelector, yearsAvailable.filter(y => Number.parseInt(y) >= Number.parseInt(beginYear)).map(y => { return { text: y, value: y } }), year);
    setEndMonthSelector();
}

function setEndMonthSelector() {
    let endMonthsAvailable = (beginYear == endYear)
        ? calculatedMonths[0].allMonths.filter(m => m.year == endYear && m.month >= beginMonth).map(m => m.month).sort((a, b) => a - b)
        : calculatedMonths[0].allMonths.filter(m => m.year == endYear).map(m => m.month).sort((a, b) => a - b);
    endMonth = (beginYear != endYear && endMonthsAvailable.some(m => m == "11")) ? "11" : endMonthsAvailable[endMonthsAvailable.length - 1];
    setOptions(monthEndSelector, endMonthsAvailable.map(m => { return { text: getMonthName(m), value: m } }), endMonth);
}

function yearBeginSelectorChanged(e) {
    beginYear = e.target.value;
    setBeginMonthSelector();
    setEndYearSelector(e.target.value);
}

function monthBeginSelectorChanged(e) {
    beginMonth = e.target.value;
}

function yearEndSelectorChanged(e) {
    endYear = e.target.value;
    setEndMonthSelector();
}

function monthEndSelectorChanged(e) {
    endMonth = e.target.value;
}