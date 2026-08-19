import { getMonthName } from '../utils/date.js';
import { cloneTemplate } from './dom.js';
import { bandColumns, buildDayModel, buildPeriodShare } from './tariffDisplay.js';
import { renderDayChart } from './dayChart.js';
import { renderBandShareBar } from './bandShareBar.js';

// Rendu de l'écran de résultats : table de comparaison des tarifs et accordéons
// de détail mensuel/journalier. Le HTML vit dans les <template> d'index.html ;
// ce module se contente de les cloner et d'y injecter les valeurs.
// sumPeriod est injectée par la vue (voir app.js) : aucun import de core/ ici.
export function render(container, calculatedMonths, dateBegin, dateEnd, sumPeriod) {
    container.innerHTML = "";

    const resultsForPeriod = calculatedMonths.map((t) => {
        return {
            tarif: sumPeriod(t.allMonths, dateBegin, dateEnd),
            title: t.title,
            lastUpdate: t.lastUpdate,
            subscription_url: t.subscription_url,
            display: t.display
        }
    });

    const consoForPeriod = resultsForPeriod[0].tarif.conso;
    const resultsOrdered = [...resultsForPeriod].sort((a, b) => a.tarif.price - b.tarif.price);

    const summary = cloneTemplate("tpl-result-summary");
    summary.refs["conso-title"].textContent =
        "Consommation  totale pour cette période : " + (consoForPeriod / 1000).toFixed(2) + "kWh";
    const resultsBody = summary.refs["results-body"];
    container.appendChild(summary.fragment);

    resultsOrdered.forEach((result, index) => {
        resultsBody.appendChild(renderTarifRow(result, index, resultsOrdered[0], dateBegin));
    });
}

function renderTarifRow(result, index, bestResult, dateBegin) {
    const accordionRowId = dateBegin.getFullYear() + "-" + index;
    const { fragment, refs } = cloneTemplate("tpl-tarif-row");
    const monthCount = result.tarif.months.length;

    refs["toggle"].setAttribute("data-bs-target", "#" + accordionRowId);
    refs["toggle"].setAttribute("aria-controls", accordionRowId);
    refs["accordion-row"].id = accordionRowId;

    refs["title"].textContent = result.title;
    refs["last-update"].textContent = `Dernière mise à jour : ${result.lastUpdate}`;
    if (result.subscription_url) {
        refs["provider-link"].href = result.subscription_url;
    }
    else {
        refs["link-br"].remove();
        refs["provider-link"].remove();
    }

    const share = buildPeriodShare(result.tarif.months, result.display);
    if (share) {
        refs["band-share"].appendChild(renderBandShareBar(share));
    }
    else {
        refs["band-share"].remove();
    }

    insertTextBeforeSup(refs["monthly-price"], (result.tarif.price / monthCount).toFixed(2));
    setTextAroundBr(refs["total-price"], "soit " + result.tarif.price.toFixed(2) + " €", " pour la période.");

    if (index == 0) {
        refs["diff-main"].appendChild(cloneTemplate("tpl-diff-best").fragment);
    }
    else {
        const diff = cloneTemplate("tpl-diff-worse");
        const priceDiff = result.tarif.price - bestResult.tarif.price;
        insertTextBeforeSup(diff.refs["diff-badge"], " " + (priceDiff / monthCount).toFixed(2));
        setTextAroundBr(diff.refs["diff-total"], "+ " + priceDiff.toFixed(2) + " €", " sur ces " + monthCount + " mois.");
        refs["diff-main"].appendChild(diff.refs["diff-badge"]);
        refs["diff-container"].appendChild(diff.fragment);
    }

    // Détail mensuel construit à la première ouverture de l'accordéon :
    // rendre d'avance ~700 jours par tarif pèserait inutilement.
    refs["accordion-row"].addEventListener("show.bs.collapse", () => {
        result.tarif.months.forEach((m) => {
            refs["accordion-cell"].appendChild(renderMonthDetail(m, result.display));
        });
    }, { once: true });

    return fragment;
}

function renderMonthDetail(m, display) {
    const { fragment, refs } = cloneTemplate("tpl-month-detail");
    refs["month-name"].textContent = getMonthName(parseInt(m.month));
    refs["summary-conso"].textContent = (m.conso / 1000).toFixed(2) + "kWh";
    refs["summary-price"].textContent = m.price.toFixed(2) + "€";

    const errorDays = m.days.filter(d => isNaN(d.conso) || isNaN(d.price)).length;
    const missingDays = m.numberOfDaysInMonth - m.days.length;
    if (errorDays > 0 || missingDays > 0) {
        const parts = [];
        if (errorDays > 0) parts.push(errorDays + " jour" + (errorDays > 1 ? "s" : "") + " en erreur");
        if (missingDays > 0) parts.push(missingDays + " jour" + (missingDays > 1 ? "s" : "") + " manquant" + (missingDays > 1 ? "s" : ""));
        refs["month-warning"].hidden = false;
        refs["month-warning"].title = parts.join(", ");
    } else {
        refs["month-warning"].remove();
    }

    // Un tarif à bande unique (prix unique) n'affiche pas de colonnes de bande.
    const columns = bandColumns(display);
    const bands = columns.length > 1 ? columns : [];

    appendColumnHeader(refs["header-row"], "Jour", null, "text-start");
    appendColumnHeader(refs["header-row"], "Conso totale", null);
    for (const band of bands) {
        appendColumnHeader(refs["header-row"], band.label, band.color);
    }
    appendColumnHeader(refs["header-row"], "Total (€)", null, "text-end");

    // Parcours inversé de m.days, qui suit l'ordre du parser : les exports
    // EDF/Enedis/Total sont livrés du plus récent au plus ancien, le mois
    // s'affiche donc du 1er au dernier jour (ordre chronologique).
    for (let j = m.days.length - 1; j >= 0; j--) {
        // Zébrage par paire ligne jour + ligne graphe (table-striped ne
        // convient plus : les lignes de graphe masquées cassent l'alternance).
        const isAlternate = (m.days.length - 1 - j) % 2 === 1;
        refs["daily-body"].appendChild(renderDayRow(m.days[j], display, bands, isAlternate));
    }

    return fragment;
}

function appendColumnHeader(headerRow, label, color, align) {
    const { fragment, refs } = cloneTemplate("tpl-day-col-header");
    refs["label"].textContent = label;
    if (color) {
        refs["dot"].style.backgroundColor = color;
    } else {
        refs["dot"].remove();
    }
    if (align) {
        refs["header"].classList.remove("text-center");
        refs["header"].classList.add(align);
    }
    headerRow.appendChild(fragment);
}

function renderDayRow(day, display, bands, isAlternate) {
    const hasError = isNaN(day.conso) || isNaN(day.price);
    if (hasError) {
        const { fragment, refs } = cloneTemplate("tpl-day-row-error");
        refs["date"].textContent = day.date;
        refs["error-cell"].colSpan = bands.length + 2;
        if (isAlternate) {
            refs["date"].parentElement.classList.add("day-row-alt");
        }
        return fragment;
    }

    const model = buildDayModel(day, display);
    const { fragment, refs } = cloneTemplate("tpl-day-row");
    if (isAlternate) {
        refs["date-cell"].parentElement.classList.add("day-row-alt");
    }

    refs["date"].textContent = day.date;
    refs["date-cell"].setAttribute("data-label", "Jour");
    if (model.badge) {
        refs["day-badge"].textContent = model.badge.label;
        refs["day-badge"].style.backgroundColor = model.badge.color;
        refs["day-badge"].style.color = model.badge.ink;
    } else {
        refs["day-badge"].remove();
    }

    refs["conso"].textContent = (day.conso / 1000).toFixed(2) + "kWh";
    refs["conso"].setAttribute("data-label", "Conso totale");

    const priceCell = refs["price"];
    for (const band of bands) {
        const cell = cloneTemplate("tpl-day-band-cell");
        const sums = model.byBand[band.id] || { conso: 0, price: 0 };
        cell.refs["band-conso"].textContent = (sums.conso / 1000).toFixed(2) + "kWh";
        cell.refs["band-price"].textContent = sums.price.toFixed(2) + "€";
        cell.refs["band-cell"].setAttribute("data-label", band.label);
        priceCell.parentNode.insertBefore(cell.fragment, priceCell);
    }

    priceCell.textContent = day.price.toFixed(2) + "€";
    priceCell.setAttribute("data-label", "Total");

    // Graphe horaire : ligne masquée, SVG construit à la première ouverture.
    const chart = cloneTemplate("tpl-day-chart");
    const chartRow = chart.refs["chart-row"];
    const chartCell = chart.refs["chart-cell"];
    chartCell.colSpan = bands.length + 3;
    if (isAlternate) {
        chartRow.classList.add("day-row-alt");
    }
    refs["chart-toggle"].addEventListener("click", (event) => {
        if (!chartCell.hasChildNodes()) {
            chartCell.appendChild(renderDayChart(day, display));
        }
        chartRow.toggleAttribute("hidden");
        event.currentTarget.classList.toggle("day-chart-toggle-open", !chartRow.hasAttribute("hidden"));
    });
    fragment.appendChild(chart.fragment);

    return fragment;
}

// Les badges mélangent texte dynamique et balises (<sup>, <br/>) : ces helpers
// insèrent les nœuds texte aux positions attendues par les templates.
function insertTextBeforeSup(badge, text) {
    badge.insertBefore(document.createTextNode(text), badge.querySelector("sup"));
}

function setTextAroundBr(badge, before, after) {
    badge.insertBefore(document.createTextNode(before), badge.querySelector("br"));
    badge.appendChild(document.createTextNode(after));
}
