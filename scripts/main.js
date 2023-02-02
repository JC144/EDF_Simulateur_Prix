viewManager.init();

var data = [];
const formImport = document.getElementById("formImport");
const csvFile = document.getElementById("csvFile");
const importResult = document.getElementById("importResult");
const showSubscriptionPicker = document.getElementById("showSubscriptionPicker");
const viewResults = document.getElementById("viewResults");

formImport.addEventListener("submit", onFormSubmitted);
showSubscriptionPicker.addEventListener("click", (e) => viewManager.displayNextView());
viewResults.addEventListener("click", (e) => displayResults());

function onFormSubmitted(e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        let rawCSV = parser.parseCSV(text);
        data = parser.loadData(rawCSV);

        //Display data
        const listOfDays = document.createElement("ul");
        for (let i = 0; i < data.length; i++) {
            const day = document.createElement("li");
            day.innerHTML = data[i].date;

            const listOfHours = document.createElement("ul");
            for (let j = data[i].hours.length - 1; j >= 0; j--) {
                const hour = document.createElement("li");
                hour.innerHTML = data[i].hours[j][0] + " - " + data[i].hours[j][1];
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

function displayResults() {
    viewManager.displayNextView();
    const pricesResult = document.getElementById("pricesResult");
    var result = tarifBleuHC.getTarif(9, data);
    //Display result
    const year = document.createElement("p");
    year.innerHTML = (result.conso/1000)+"kWh - "+result.price+"€";
    const listOfMonths = document.createElement("ul");
    for (let i = 0; i < result.months.length; i++) {
        const month = document.createElement("li");
        month.innerHTML = result.months[i].month + " - " + (result.months[i].conso/1000) + "kWh - " + result.months[i].price+ "€";

        const listOfDays = document.createElement("ul");
        for (let j = result.months[i].days.length - 1; j >= 0; j--) {
            const day = document.createElement("li");
            day.innerHTML = result.months[i].days[j].date+ " - " + (result.months[i].days[j].conso/1000) + "kWh - " + result.months[i].days[j].price + "€";
            listOfDays.appendChild(day);
        }
        pricesResult.appendChild(year);
        month.appendChild(listOfDays);
        listOfMonths.appendChild(month);
        pricesResult.appendChild(listOfMonths);
    }
}
