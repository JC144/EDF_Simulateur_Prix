import { getMonthName } from '../utils/date.js';
import { cloneTemplate } from './dom.js';
import { bandColumns, buildDayModel, buildPeriodShare } from './tariffDisplay.js';
import { renderDayChart } from './dayChart.js';
import { renderBandShareBar } from './bandShareBar.js';
import { isStale, STALE_MONTHS, tarifPagePath } from '../utils/tarifMeta.js';

const MIN_MONTHLY_SAVINGS_FOR_SUPPORT = 5; // €/mois

// Rendu de l'écran de résultats : table de comparaison des tarifs et accordéons
// de détail mensuel/journalier. Le HTML vit dans les <template> d'index.html ;
// ce module se contente de les cloner et d'y injecter les valeurs.
// sumPeriod est injectée par la vue (voir app.js) : aucun import de core/ ici.
export function createResultsTable(container, currentOffer, dateBegin, dateEnd, sumPeriod) {
    const summary = cloneTemplate("tpl-result-summary");
    const body = summary.refs["results-body"];
    container.replaceChildren(summary.fragment);
    const ranked = [];
    let processed = 0;
    let reference;

    // Une table par période. Insérer uniquement les nouvelles lignes conserve
    // les détails ouverts et évite de recalculer les répartitions déjà affichées.
    return function update({ calculatedMonths, missingCalendars }, complete) {
        const unavailable = new Set(missingCalendars
            .filter(c => c.months.some(m => m >= dateBegin && m <= dateEnd)).map(c => c.title));
        const notice = summary.refs["calendar-notice"];
        if (unavailable.size) {
            notice.hidden = false;
            notice.textContent = `Calendrier de pointe incomplet sur la période sélectionnée. Offre hors classement : ${[...unavailable].join(", ")}.`;
        }
        const added = [];
        for (; processed < calculatedMonths.length; processed++) {
            const { title, lastUpdate, display, allMonths } = calculatedMonths[processed];
            if (unavailable.has(title)) continue;
            const result = { title, lastUpdate, display, tarif: sumPeriod(allMonths, dateBegin, dateEnd) };
            if (!ranked.length) {
                summary.refs["conso-title"].textContent = "Consommation  totale pour cette période : "
                    + (result.tarif.conso / 1000).toFixed(2) + "kWh";
            }
            const { fragment, refs } = renderTarifRow(result, processed, dateBegin);
            result.refs = refs;
            result.row = fragment.firstElementChild;
            const index = result.title === currentOffer ? 0 : ranked.findIndex(other =>
                other.title !== currentOffer && other.tarif.price > result.tarif.price);
            body.insertBefore(fragment, ranked[index]?.row ?? null);
            ranked.splice(index < 0 ? ranked.length : index, 0, result);
            added.push(result);
        }
        if (!ranked.length) {
            summary.refs["conso-title"].textContent = complete ? "Aucune offre disponible pour cette période."
                : "En attente des premières offres pour cette période…";
            return;
        }

        const selected = ranked[0].title === currentOffer;
        const waitingForCurrent = currentOffer && !selected && !complete;
        summary.refs["diff-heading"].textContent = selected || waitingForCurrent
            ? "Diff. avec votre offre" : "Diff. avec le plus avantageux";
        const previousReference = reference;
        reference = waitingForCurrent ? null : ranked[0];
        const changed = (reference !== previousReference || complete) ? ranked : added;
        for (const result of changed) renderDifference(result, reference, selected, complete);

        if (!complete) return;
        const cheapest = ranked[1]?.tarif;
        if (!selected || (cheapest?.months.length > 0 &&
            reference.tarif.price >= cheapest.price + MIN_MONTHLY_SAVINGS_FOR_SUPPORT * cheapest.months.length)) {
            const supportRow = cloneTemplate("tpl-results-support-row");
            const supportCta = document.querySelector("body > .support-cta");
            supportRow.refs["support-cell"].appendChild(supportCta.cloneNode(true));
            body.insertBefore(supportRow.fragment, ranked[3]?.row ?? null);
        }
    };
}

function renderTarifRow(result, index, dateBegin) {
    const accordionRowId = dateBegin.getFullYear() + "-" + index;
    const { fragment, refs } = cloneTemplate("tpl-tarif-row");
    const monthCount = result.tarif.months.length;

    refs["toggle"].setAttribute("data-bs-target", "#" + accordionRowId);
    refs["toggle"].setAttribute("aria-controls", accordionRowId);
    refs["accordion-row"].id = accordionRowId;

    refs["title"].textContent = result.title;
    refs["last-update"].textContent = `Dernière mise à jour : ${result.lastUpdate}`;
    if (isStale(result.lastUpdate)) {
        const warning = refs["stale-warning"];
        const message = `Tarif mis à jour il y a plus de ${STALE_MONTHS} mois : vérifiez-le sur le site du fournisseur.`;
        warning.hidden = false;
        warning.title = message;
        warning.setAttribute("aria-label", message);
        // Tooltip Bootstrap (bundle chargé en script classique) : s'affiche
        // aussi au focus, donc au toucher sur mobile, contrairement à title.
        new bootstrap.Tooltip(warning);
    }
    else {
        refs["stale-warning"].remove();
    }
    // Page de grille générée (tarifs/<slug>.html) : liens fournisseur et PDF.
    refs["offer-link"].href = tarifPagePath(result.title);

    const share = buildPeriodShare(result.tarif.months, result.display);
    if (share) {
        refs["band-share"].appendChild(renderBandShareBar(share));
    }
    else {
        refs["band-share"].remove();
    }

    insertTextBeforeSup(refs["monthly-price"], (result.tarif.price / monthCount).toFixed(2));
    setTextAroundBr(refs["total-price"], "soit " + result.tarif.price.toFixed(2) + " €", " pour la période.");

    // Détail mensuel construit à la première ouverture de l'accordéon.
    refs["accordion-row"].addEventListener("show.bs.collapse", () => {
        result.tarif.months.forEach((m) => {
            refs["accordion-cell"].appendChild(renderMonthDetail(m, result.display));
        });
    }, { once: true });
    return { fragment, refs };
}

function renderDifference(result, reference, selected, complete) {
    const refs = result.refs;
    refs["diff-main"].replaceChildren();
    refs["diff-container"].replaceChildren(refs["diff-main"]);
    if (!reference) {
        refs["diff-main"].textContent = "—";
        return;
    }
    if (result === reference) {
        if (selected || complete) {
            refs["diff-main"].appendChild(cloneTemplate(selected ? "tpl-diff-current" : "tpl-diff-best").fragment);
        } else {
            refs["diff-main"].textContent = "Meilleur prix provisoire";
        }
    }
    else {
        const monthCount = result.tarif.months.length;
        const diff = cloneTemplate("tpl-diff-amount");
        const priceDiff = result.tarif.price - reference.tarif.price;
        const totalDiff = signedPrice(priceDiff);
        const badgeColor = Number(totalDiff) < 0 ? "success" : Number(totalDiff) > 0 ? "warning" : "secondary";
        diff.refs["diff-badge"].classList.add("text-bg-" + badgeColor);
        insertTextBeforeSup(diff.refs["diff-badge"], signedPrice(priceDiff / monthCount));
        setTextAroundBr(diff.refs["diff-total"], totalDiff + " €", " sur ces " + monthCount + " mois.");
        refs["diff-main"].appendChild(diff.refs["diff-badge"]);
        refs["diff-container"].appendChild(diff.fragment);
    }
}

function signedPrice(price) {
    const rounded = price.toFixed(2);
    if (Number(rounded) === 0) return "0.00";
    return price > 0 ? "+" + rounded : rounded;
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
