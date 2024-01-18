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
    let dateBegin = new Date(beginYear, beginMonth, 1);
    let dateEnd = new Date(endYear, endMonth, 1);
    refreshResultView(dateBegin, dateEnd);
});

csvFile.addEventListener("change", onFileImported);
importError.style.display = "none";

document.getElementById("startButton").onclick = function () { viewManager.displayNextView(); };
document.getElementById("simulateButton").onclick = function () {
    displayResults();
};

function onFileImported(e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        importError.style.display = "none";

        var parser = edfParser;
        const text = e.target.result;

        if (csvFile.files[0].name.includes("Enedis")) {
            parser = enedisParser;
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

function calculateAllMonths(kva, jourZenPlus) {
    calculatedMonths = abonnements.map(abo => {
        return {
            allMonths: calculator.getTarif(kva, data, abo, jourZenPlus),
            title: abo.name
        }
    });
    yearsAvailable = [...new Set(calculatedMonths[0].allMonths.map(m => m.year))].sort((a, b) => a - b);
}

function displayResults() {
    calculateAllMonths(kvaSelector.value, jourZenPlusSelector.value);

    setBeginYearSelector();
    setBeginMonthSelector();
    setEndYearSelector(yearsAvailable[yearsAvailable.length - 1]);
    setEndMonthSelector(endYear);

    let dateBegin = new Date(beginYear, beginMonth, 1);
    let dateEnd = new Date(endYear, endMonth, 1);

    viewManager.displayNextView();
    refreshResultView(dateBegin, dateEnd);
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
    rowHeader.appendChild(headerEstimationName);

    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody);

    let currentRow = 0;
    resultsForPeriod.map((r) => ({
        tarif: r.tarif,
        title: r.title
    }))
        .sort((a, b) => a.tarif.price - b.tarif.price)
        .forEach(result => {
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
            accordionCell.colSpan = 2;
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
                    const cell2BodyDailyDetail = document.createElement("td");
                    const cell3BodyDailyDetail = document.createElement("td");
                    const cell4BodyDailyDetail = document.createElement("td");
                    const cell5BodyDailyDetail = document.createElement("td");
                    const cell6BodyDailyDetail = document.createElement("td");
                    const cell7BodyDailyDetail = document.createElement("td");

                    cell1BodyDailyDetail.innerHTML = m.days[j].date;
                    cell2BodyDailyDetail.innerHTML = (m.days[j].conso / 1000).toFixed(2) + "kWh";
                    cell3BodyDailyDetail.innerHTML = (m.days[j].consoHC/1000).toFixed(2) + "kWh";
                    cell4BodyDailyDetail.innerHTML = m.days[j].priceHC.toFixed(2) + "€";
                    cell5BodyDailyDetail.innerHTML = (m.days[j].consoHP/1000).toFixed(2) + "kWh";
                    cell6BodyDailyDetail.innerHTML = m.days[j].priceHP.toFixed(2) + "€";
                    cell7BodyDailyDetail.innerHTML = m.days[j].price.toFixed(2) + "€";
                    bodyDailyDetail.appendChild(cell1BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell2BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell3BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell4BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell5BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell6BodyDailyDetail);
                    bodyDailyDetail.appendChild(cell7BodyDailyDetail);
                }
            });

            const cellTarifName = document.createElement("th");
            tarifRow.appendChild(cellTarifName);
            cellTarifName.innerHTML = result.title;

            const cellTarifPrice = document.createElement("td");
            tarifRow.appendChild(cellTarifPrice);
            cellTarifPrice.innerHTML = result.tarif.price.toFixed(2) + " € TTC";
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