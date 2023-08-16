viewManager.init();

var data = [];
const formImport = document.getElementById("formImport");
const csvFile = document.getElementById("csvFile");

csvFile.addEventListener("change", onFileImported);

function onFileImported(e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    
    reader.onload = function (e) {
        var parser = edfParser;
        const text = e.target.result;

        if (csvFile.files[0].name.includes("Enedis")) {
            parser = enedisParser;    
        }
        
        let rawCSV = parser.parseCSV(text);
        data = parser.loadData(rawCSV);

        displayResults();
    };
    reader.readAsText(input);
}

function displayResults() {
    viewManager.displayNextView();

    let resultBleu = {};
    resultBleu.tarif = calculator.getTarif(9, data, tarifBleu);
    resultBleu.title = "Le tarif Bleu";
    displayTarif(resultBleu);

    let resultBleuHC = {};
    resultBleuHC.tarif = calculator.getTarif(9, data, tarifBleuHC);
    resultBleuHC.title = "Le tarif Bleu Heures Creuses";
    displayTarif(resultBleuHC);

    let resultTempo = {};
    resultTempo.tarif = calculator.getTarif(9, data, tarifTempo);
    resultTempo.title = "Le tarif Tempo";
    displayTarif(resultTempo);

    let resultZenFlex = {};
    resultZenFlex.tarif = calculator.getTarif(9, data, tarifZenFlex);
    resultZenFlex.title = "Le tarif ZenFlex";
    displayTarif(resultZenFlex);
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

    const resultCol = document.createElement("div");
    resultCol.classList.add("col-sm");
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

    year.innerHTML = "Consommation : " + (result.tarif.conso / 1000).toFixed(2) + "kWh <br/> " + "Estimation : " + result.tarif.price.toFixed(2) + " € TTC";

    const listOfMonths = document.createElement("ul");
    resultCol.appendChild(listOfMonths);

    for (let i = 0; i < result.tarif.months.length; i++) {
        const month = document.createElement("li");
        listOfMonths.appendChild(month);
        month.innerHTML = getMonthName(parseInt(result.tarif.months[i].month)) + "<br/>" + (result.tarif.months[i].conso / 1000).toFixed(2) + "kWh<br/>" + result.tarif.months[i].price.toFixed(2) + "€";

        const listOfDays = document.createElement("ul");
        month.appendChild(listOfDays);
        for (let j = result.tarif.months[i].days.length - 1; j >= 0; j--) {
            const day = document.createElement("li");
            day.innerHTML = result.tarif.months[i].days[j].date + "<br/>" + (result.tarif.months[i].days[j].conso / 1000).toFixed(2) + "kWh<br/>HC: " + result.tarif.months[i].days[j].priceHC.toFixed(2) + "€ <br/>HP: " + result.tarif.months[i].days[j].priceHP.toFixed(2) + "€ <br/>" + result.tarif.months[i].days[j].price.toFixed(2) + "€";
            listOfDays.appendChild(day);
        }
    }
}

