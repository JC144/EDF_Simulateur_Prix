viewManager.init();

var data = [];
const formImport = document.getElementById("formImport");
const csvFile = document.getElementById("csvFile");
const importResult = document.getElementById("importResult");

const tarifBleuButton = document.getElementById("tarifBleuButton");
const tarifBleuHCButton = document.getElementById("tarifBleuHCButton");
const tarifTempoButton = document.getElementById("tarifTempoButton");


csvFile.addEventListener("change", onFileImported);

tarifBleuButton.addEventListener("click", () => displayResults("bleu"));
tarifBleuHCButton.addEventListener("click", () => displayResults("bleuHC"));
tarifTempoButton.addEventListener("click", () => displayResults("tempo"));


function onFileImported(e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        let rawCSV = parser.parseCSV(text);
        data = parser.loadData(rawCSV);

        //Display data
        const listOfDays = document.createElement("ul");
        listOfDays.classList.add("list-group");
        for (let i = 0; i < data.length; i++) {
            const day = document.createElement("li");
            day.classList.add("list-group-item");
            day.innerHTML = data[i].date;

            const listOfHours = document.createElement("ul");
            listOfHours.classList.add("list-group");
            for (let j = data[i].hours.length - 1; j >= 0; j--) {
                const hour = document.createElement("li");
                hour.classList.add("list-group-item");
                hour.innerHTML = data[i].hours[j][0] + " - " + data[i].hours[j][1] + "Wh";
                listOfHours.appendChild(hour);
            }
            day.appendChild(listOfHours);
            listOfDays.appendChild(day);
            importResult.appendChild(listOfDays);
        }
        viewManager.displayNextView();
    };
    reader.readAsText(input);
}

function displayResults(tarif) {
    viewManager.displayNextView();
    const pricesResult = document.getElementById("pricesResult");
    const tarifHeader = document.getElementById("tarifHeader");

    let result = {};
    if (tarif == "bleu") {
        result = tarifBleu.getTarif(9, data);
        tarifHeader.innerHTML = "Votre simulation avec le tarif Bleu";
    }
    else if (tarif == "bleuHC") {
        result = tarifBleuHC.getTarif(9, data);
        tarifHeader.innerHTML = "Votre simulation avec le tarif Bleu Heures Creuses";
    }
    else {
        result = tarifTempo.getTarif(9, data);
        tarifHeader.innerHTML = "Votre simulation avec le tarif Tempo";
    }

    const year = document.createElement("p");
    year.innerHTML = (result.conso / 1000).toFixed(2) + "kWh - " + result.price.toFixed(2) + "€";
    const listOfMonths = document.createElement("ul");
    for (let i = 0; i < result.months.length; i++) {
        const month = document.createElement("li");
        month.innerHTML = getMonthName(parseInt(result.months[i].month)) + " - " + (result.months[i].conso / 1000).toFixed(2) + "kWh - " + result.months[i].price.toFixed(2) + "€";

        const listOfDays = document.createElement("ul");
        for (let j = result.months[i].days.length - 1; j >= 0; j--) {
            const day = document.createElement("li");
            day.innerHTML = result.months[i].days[j].date + " - " + (result.months[i].days[j].conso / 1000).toFixed(2) + "kWh - " + result.months[i].days[j].price.toFixed(2) + "€";
            listOfDays.appendChild(day);
        }
        pricesResult.appendChild(year);
        month.appendChild(listOfDays);
        listOfMonths.appendChild(month);
        pricesResult.appendChild(listOfMonths);
    }
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    let monthString = date.toLocaleString('fr-FR', { month: 'long' });
    return monthString.charAt(0).toUpperCase() + monthString.slice(1)
}

