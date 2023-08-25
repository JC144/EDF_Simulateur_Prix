viewManager.init();

var data = [];

const formImport = document.getElementById("formImport");
const csvFile = document.getElementById("csvFile");
const kvaSelector = document.getElementById("puissanceSouscrite");
const jourZenPlusSelector = document.getElementById("jourZenPlus");
const simulateButton = document.getElementById("simulateButton");
const importError = document.getElementById("importError");

csvFile.addEventListener("change", onFileImported);
importError.style.display = "none";

document.getElementById("startButton").onclick = function () { viewManager.displayNextView(); };
document.getElementById("simulateButton").onclick = function () { displayResults(kvaSelector.value, jourZenPlusSelector.value); };

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

function displayResults(kva, jourZenPlus) {
    viewManager.displayNextView();
    const results = []
    abonnements.forEach((abo) => {
        let result = {};
        result.tarif = calculator.getTarif(kva, data, abo, jourZenPlus);
        result.title = abo.name;
        results.push(result);
    });

    const yearsAvailableWithConso = results[0].tarif.map((v) => ({ year: v.year, conso: v.conso }));
    yearsAvailableWithConso.forEach((currentYearAndConso) => {
        const divYear = document.createElement("div");
        divYear.className = "mb-4";
        pricesResultRow.appendChild(divYear);
        const titleYear = document.createElement("h3");
        divYear.appendChild(titleYear);
        titleYear.className = "main-title";
        const titleConso = document.createElement("h4");
        divYear.appendChild(titleConso);
        titleConso.className = "sub-title";

        titleYear.innerHTML = "Mars " + (currentYearAndConso.year - 1) + " à Mars " + currentYearAndConso.year;
        titleConso.innerHTML = "Consommation : " + (currentYearAndConso.conso / 1000).toFixed(2) + "kWh";

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
        results.map((r) => ({
            tarif: r.tarif
                .find((t) => t.year == currentYearAndConso.year),
            title: r.title
        }))
            .sort((a, b) => a.tarif.price - b.tarif.price)
            .forEach(result => {
                const tarifRow = document.createElement("tr");
                const accordionRowId = currentYearAndConso.year + "-" + currentRow;
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
                    cell1HeaderDailyDetail.innerHTML = "Jour";
                    cell2HeaderDailyDetail.innerHTML = "Consommation totale";
                    cell3HeaderDailyDetail.innerHTML = "Estimation HC (€)";
                    cell4HeaderDailyDetail.innerHTML = "Estimation HP (€)";
                    cell5HeaderDailyDetail.innerHTML = "Total (€)";
                    headerDailyDetail.appendChild(cell1HeaderDailyDetail);
                    headerDailyDetail.appendChild(cell2HeaderDailyDetail);
                    headerDailyDetail.appendChild(cell3HeaderDailyDetail);
                    headerDailyDetail.appendChild(cell4HeaderDailyDetail);
                    headerDailyDetail.appendChild(cell5HeaderDailyDetail);
                    for (let j = m.days.length - 1; j >= 0; j--) {
                        const bodyDailyDetail = document.createElement("tr");
                        tableDailyDetail.appendChild(document.createElement("tbody").appendChild(bodyDailyDetail));
                        const cell1BodyDailyDetail = document.createElement("td");
                        const cell2BodyDailyDetail = document.createElement("td");
                        const cell3BodyDailyDetail = document.createElement("td");
                        const cell4BodyDailyDetail = document.createElement("td");
                        const cell5BodyDailyDetail = document.createElement("td");
                        cell1BodyDailyDetail.innerHTML = m.days[j].date;
                        cell2BodyDailyDetail.innerHTML = (m.days[j].conso / 1000).toFixed(2) + "kWh";
                        cell3BodyDailyDetail.innerHTML = m.days[j].priceHC.toFixed(2) + "€";
                        cell4BodyDailyDetail.innerHTML = m.days[j].priceHP.toFixed(2) + "€";
                        cell5BodyDailyDetail.innerHTML = m.days[j].price.toFixed(2) + "€";
                        bodyDailyDetail.appendChild(cell1BodyDailyDetail);
                        bodyDailyDetail.appendChild(cell2BodyDailyDetail);
                        bodyDailyDetail.appendChild(cell3BodyDailyDetail);
                        bodyDailyDetail.appendChild(cell4BodyDailyDetail);
                        bodyDailyDetail.appendChild(cell5BodyDailyDetail);
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
    });
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    let monthString = date.toLocaleString('fr-FR', { month: 'long' });
    return monthString.charAt(0).toUpperCase() + monthString.slice(1)
}