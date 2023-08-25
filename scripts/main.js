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

        results.map((r) => ({
            price: r.tarif
                .find((t) => t.year == currentYearAndConso.year).price,
            title: r.title
        }))
            .sort((a, b) => a.price - b.price)
            .forEach(result => {
                const tarifRow = document.createElement("tr");
                tableBody.appendChild(tarifRow);

                const cellTarifName = document.createElement("th");
                tarifRow.appendChild(cellTarifName);
                cellTarifName.innerHTML = result.title;

                const cellTarifPrice = document.createElement("td");
                tarifRow.appendChild(cellTarifPrice);
                cellTarifPrice.innerHTML = result.price.toFixed(2) + " € TTC";
            });
    });
}