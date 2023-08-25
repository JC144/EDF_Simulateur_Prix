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
        const titleConso = document.createElement("h4");
        divYear.appendChild(titleConso);

        titleYear.innerHTML = "Mars " + (currentYearAndConso.year - 1) + " à Mars " + currentYearAndConso.year;
        titleConso.innerHTML = "Consommation : " + (currentYearAndConso.conso / 1000).toFixed(2) + "kWh";

        const table = document.createElement("table");
        table.className = "table";
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

                const dailyDetailTitle = document.createElement("h4");
                accordionCell.appendChild(dailyDetailTitle);
                dailyDetailTitle.innerHTML = "Détail journalier : <br/>";
                result.tarif.months.forEach((m) => {
                    const month = document.createElement("li");
                    accordionCell.appendChild(month);
                    month.innerHTML = getMonthName(parseInt(m.month)) + "<br/>" + (m.conso / 1000).toFixed(2) + "kWh<br/>" + m.price.toFixed(2) + "€";

                    const listOfDays = document.createElement("ul");
                    month.appendChild(listOfDays);
                    for (let j = m.days.length - 1; j >= 0; j--) {
                        const day = document.createElement("li");
                        day.innerHTML = m.days[j].date + "<br/>" + (m.days[j].conso / 1000).toFixed(2) + "kWh<br/>HC: " + m.days[j].priceHC.toFixed(2) + "€ <br/>HP: " + m.days[j].priceHP.toFixed(2) + "€ <br/>" + m.days[j].price.toFixed(2) + "€";
                        listOfDays.appendChild(day);
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