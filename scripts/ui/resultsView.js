import { setOptions } from './dom.js';
import { getMonthName } from '../utils/date.js';

// Écran de résultats : sélecteurs de période (début/fin) et bouton de
// rafraîchissement. Détient l'état de la période et la simulation courante.
// sumPeriod (agrégation d'une période, voir core/calculator.js) est injectée
// par app.js pour ne pas coupler les modules ui/ au moteur.
export function initResultsView({ sumPeriod, onRetry }) {
    let simulation = null;
    let createResultsTable;
    let updateTable;
    let complete = false;
    const status = document.getElementById("calculationStatus");
    const label = document.getElementById("calculationLabel");
    const count = document.getElementById("calculationCount");
    const progressBar = document.getElementById("calculationProgress");
    const retry = document.getElementById("retryCalculation");
    const period = document.getElementById("resultPeriod");
    const rows = document.getElementById("pricesResultRow");
    retry.addEventListener("click", onRetry);

    let beginYear = 0;
    let beginMonth = 0;
    let endYear = 0;
    let endMonth = 0;

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
        refresh();
        refreshButton.disabled = true;
    });

    function refresh() {
        const dateBegin = new Date(beginYear, beginMonth - 1, 1);
        const dateEnd = new Date(endYear, endMonth - 1, 1);
        updateTable = createResultsTable(rows, simulation.currentOffer, dateBegin, dateEnd, sumPeriod);
        updateTable(simulation, complete);
    }

    function showResults(newSimulation) {
        simulation = newSimulation;
        if (!simulation.yearsAvailable.length) return;
        if (updateTable) {
            updateTable(simulation, complete);
            return;
        }
        setBeginYearSelector();
        setBeginMonthSelector();
        setEndYearSelector(simulation.yearsAvailable.at(-1));
        refresh();
        refreshButton.disabled = true;
        period.hidden = false;
    }

    function setBeginYearSelector() {
        beginYear = simulation.yearsAvailable[0];
        setOptions(yearBeginSelector, simulation.yearsAvailable.map(y => { return { text: y, value: y } }), beginYear);
    }

    function setBeginMonthSelector() {
        let beginMonthsAvailable = simulation.calculatedMonths[0].allMonths.filter(m => m.year == beginYear).map(m => m.month).sort((a, b) => a - b);
        // Note (comportement historique conservé) : ce find compare m.month sur des
        // chaînes de mois, il est toujours undefined et on retombe sur le 1er mois.
        beginMonth = beginMonthsAvailable.find(m => (m.month == "11"));
        beginMonth = beginMonth ? beginMonth : beginMonthsAvailable[0];
        setOptions(monthBeginSelector, beginMonthsAvailable.map(m => { return { text: getMonthName(m), value: m } }), beginMonth);
    }

    function setEndYearSelector(year) {
        endYear = year;
        setOptions(yearEndSelector, simulation.yearsAvailable.filter(y => Number.parseInt(y) >= Number.parseInt(beginYear)).map(y => { return { text: y, value: y } }), year);
        setEndMonthSelector();
    }

    function setEndMonthSelector() {
        let endMonthsAvailable = (beginYear == endYear)
            ? simulation.calculatedMonths[0].allMonths.filter(m => m.year == endYear && m.month >= beginMonth).map(m => m.month).sort((a, b) => a - b)
            : simulation.calculatedMonths[0].allMonths.filter(m => m.year == endYear).map(m => m.month).sort((a, b) => a - b);
        endMonth = (beginYear != endYear && endMonthsAvailable.some(m => m == "11")) ? "11" : endMonthsAvailable[endMonthsAvailable.length - 1];
        setOptions(monthEndSelector, endMonthsAvailable.map(m => { return { text: getMonthName(m), value: m } }), endMonth);
    }

    function yearBeginSelectorChanged(e) {
        beginYear = e.target.value;
        setBeginMonthSelector();
        setEndYearSelector(e.target.value);
        refreshButton.disabled = false;
    }

    function monthBeginSelectorChanged(e) {
        beginMonth = e.target.value;
        refreshButton.disabled = false;
    }

    function yearEndSelectorChanged(e) {
        endYear = e.target.value;
        setEndMonthSelector();
        refreshButton.disabled = false;
    }

    function monthEndSelectorChanged(e) {
        endMonth = e.target.value;
        refreshButton.disabled = false;
    }

    function setStatus(state, message, completed = 0, total = null) {
        status.dataset.state = state;
        // La région live annonce les changements de phase, le compteur reste consultable.
        if (label.textContent !== message) label.textContent = message;
        retry.hidden = state !== "error";
        progressBar.hidden = state === "error" || total === 0;
        if (total === null) {
            count.textContent = "";
            progressBar.removeAttribute("value");
        } else {
            count.textContent = total === 0 ? "0 offre analysée"
                : `${completed} / ${total} ${total === 1 ? "offre analysée" : "offres analysées"}`;
            if (total > 0) {
                progressBar.max = total;
                progressBar.value = completed;
            }
        }
    }

    return {
        async start() {
            simulation = null;
            updateTable = null;
            complete = false;
            rows.replaceChildren();
            period.hidden = true;
            setStatus("loading", "Chargement des offres…");
            window.scrollTo({ top: 0, behavior: "instant" });
            ({ createResultsTable } = await import('./resultsRenderer.js'));
        },
        progress({ completed, total, simulation }) {
            setStatus("calculating", "Classement provisoire", completed, total);
            showResults(simulation);
        },
        showError(message) {
            simulation = null;
            updateTable = null;
            rows.replaceChildren();
            period.hidden = true;
            setStatus("error", message);
        },
        show: function (newSimulation, total) {
            complete = true;
            showResults(newSimulation);
            const message = newSimulation.yearsAvailable.length
                ? "Comparaison terminée" : "Aucune offre disponible sur la période importée.";
            setStatus("complete", message, total, total);
        }
    };
}
