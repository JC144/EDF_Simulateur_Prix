import { isStale } from "./utils/tarifMeta.js";
import { formatDate } from "./utils/tarifFormat.js";
import { renderHcSection, renderPriceSections } from "./ui/grillePrices.js";

const page = document.querySelector("[data-last-update]");
const warning = document.querySelector(".tarif-stale");
if (page && warning) warning.hidden = !isStale(page.dataset.lastUpdate);

const historyPicker = document.querySelector("[data-history-url]");
if (historyPicker) enableHistory(historyPicker);

function enableHistory(picker) {
    const select = document.getElementById("grille-date");
    const latest = select.options[0].value;
    const current = document.getElementById("grille-actuelle");
    const archive = document.getElementById("grille-archivee");
    const prices = document.getElementById("archive-prix");
    const status = document.getElementById("archive-statut");
    const retry = document.getElementById("archive-reessayer");
    let versionsPromise;

    async function loadVersions() {
        const response = await fetch(picker.dataset.historyUrl);
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }

    async function showGrid() {
        const date = location.hash.replace(/^#grille-/, "");
        select.value = date;
        if (select.selectedIndex < 0) select.value = latest;
        const archived = select.value !== latest;
        current.hidden = archived;
        archive.hidden = !archived;
        retry.hidden = true;
        prices.replaceChildren();
        if (!archived) return;

        document.getElementById("archive-titre").textContent = "Grille archivée du " + formatDate(date);
        status.textContent = "Chargement de la grille…";
        try {
            versionsPromise ??= loadVersions().catch(error => {
                versionsPromise = undefined;
                throw error;
            });
            const versions = await versionsPromise;
            if (select.value !== date) return; // L'utilisateur a déjà changé de grille.
            const i = versions.findIndex(v => v.date === date);
            if (i < 0) throw new Error("Grille introuvable");
            const grid = versions[i];
            prices.innerHTML = [...renderPriceSections(grid, versions[i - 1]), ...renderHcSection(grid, "", true)].join("\n");
            if (grid.revision) {
                const link = document.createElement("a");
                link.href = "https://github.com/JC144/EDF_Simulateur_Prix/blob/" + grid.revision;
                link.textContent = "Consulter la source de cette grille sur GitHub";
                prices.append(link);
            }
            status.textContent = "";
        } catch {
            if (select.value !== date) return;
            status.textContent = "Impossible de charger cette grille.";
            retry.hidden = false;
        }
    }

    select.addEventListener("change", () => { location.hash = "grille-" + select.value; });
    document.getElementById("archive-retour").addEventListener("click", () => select.focus());
    retry.addEventListener("click", () => {
        versionsPromise = undefined;
        showGrid();
    });
    window.addEventListener("hashchange", showGrid);
    picker.hidden = false;
    showGrid();
}
