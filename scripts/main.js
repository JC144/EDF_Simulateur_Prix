viewManager.init();

var data = [];

const formImport = document.getElementById("formImport");
const csvFile = document.getElementById("csvFile");
const kvaSelector = document.getElementById("puissanceSouscrite");
const simulateButton = document.getElementById("simulateButton");
const importError = document.getElementById("importError");

csvFile.addEventListener("change", onFileImported);
importError.style.display = "none";

document.getElementById("startButton").onclick = function () { viewManager.displayNextView(); };
document.getElementById("simulateButton").onclick = function () { displayResults(kvaSelector.value); };

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

function displayResults(kva) {
    viewManager.displayNextView();
    abonnements.forEach((abo) => {
        let result = {};
        result.tarif = calculator.getTarif(kva, data, abo);
        result.title = abo.name;
        displayTarif(result);
    });
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    let monthString = date.toLocaleString('fr-FR', { month: 'long' });
    return monthString.charAt(0).toUpperCase() + monthString.slice(1)
}

function displayTarif(result) {
    const pricesResultRow = document.getElementById("pricesResultRow");
    const pricesTitleRow = document.getElementById("pricesTitleRow");
    const detailMonthyByMonth = document.getElementById("div-detailPrice");
    const detailCol = document.createElement("div");
    detailMonthyByMonth.appendChild(detailCol);

    const resultCol = document.createElement("div");
    resultCol.classList.add("col-sm");
    detailCol.classList.add("col-sm");
    pricesResultRow.appendChild(resultCol);

    const titleCol = document.createElement("div");
    titleCol.classList.add("col-sm");
    pricesTitleRow.appendChild(titleCol);

    const tarifHeader = document.createElement("h3");
    tarifHeader.classList.add("text-center");
    tarifHeader.classList.add("h3");
    tarifHeader.innerHTML = result.title;
    titleCol.appendChild(tarifHeader);

    const year = document.createElement("p");
    year.classList.add("text-center");
    year.classList.add("mt-4");
    year.classList.add("mb-4");
    resultCol.appendChild(year);

    let displayConsommationAndPrice = "";
    result.tarif.forEach((y) => {
        displayConsommationAndPrice += "Mars " + (y.year - 1) + " à Mars " + y.year + "<br />";
        displayConsommationAndPrice += "Consommation : " + (y.conso / 1000).toFixed(2) + "kWh <br/>";
        displayConsommationAndPrice += "Estimation : " + y.price.toFixed(2) + " € TTC <br/><br/> ";
    });
    year.innerHTML = displayConsommationAndPrice;

    const listOfMonths = document.createElement("ul");
    detailCol.appendChild(listOfMonths);

    result.tarif.forEach((y) => {
        y.months.forEach((m) => {
            const month = document.createElement("li");
            listOfMonths.appendChild(month);
            month.innerHTML = getMonthName(parseInt(m.month)) + "<br/>" + (m.conso / 1000).toFixed(2) + "kWh<br/>" + m.price.toFixed(2) + "€";

            const listOfDays = document.createElement("ul");
            month.appendChild(listOfDays);
            for (let j = m.days.length - 1; j >= 0; j--) {
                const day = document.createElement("li");
                day.innerHTML = m.days[j].date + "<br/>" + (m.days[j].conso / 1000).toFixed(2) + "kWh<br/>HC: " + m.days[j].priceHC.toFixed(2) + "€ <br/>HP: " + m.days[j].priceHP.toFixed(2) + "€ <br/>" + m.days[j].price.toFixed(2) + "€";
                listOfDays.appendChild(day);
            }
        });
    });
}