// Formulaire « Mon offre actuelle » (étape 4 de l'assistant) : saisie, validation
// en direct, export/import JSON. Lit et écrit le modèle d'offre décrit dans
// core/currentOffer.js ; la logique métier (conversion en tarif, validation,
// sérialisation) est injectée par app.js via offerApi — les modules ui/ ne
// dépendent pas de core/.
// offerApi : { validate(offer, kva) -> message|null, serialize(offer) -> texte,
//              parse(texte) -> offre (lève une Error), dayTypesOf(offer) -> types,
//              defaultSpot }

const DAY_LABELS = [["Lun", 1], ["Mar", 2], ["Mer", 3], ["Jeu", 4], ["Ven", 5], ["Sam", 6], ["Dim", 0]];

const TYPE_LABELS = {
    base: { unique: "Prix du kWh", weekend: "Semaine" },
    weekend: "Week-end",
    bleu: { ejp: "Jour normal", tempo: "Jour bleu" },
    blanc: "Jour blanc",
    rouge: { ejp: "Jour de pointe (EJP)", tempo: "Jour rouge" },
    hiver: "Hiver (novembre à mars)",
    ete: "Été (avril à octobre)",
    hiverWeekend: "Hiver, week-end",
    eteWeekend: "Été, week-end",
    hsc: "Heures super creuses"
};

const SPOT_FIELDS = [
    ["turpe.hiver", "TURPE hiver (c€/kWh HT)"], ["turpe.ete", "TURPE été (c€/kWh HT)"],
    ["accise", "Accise (c€/kWh HT)"],
    ["cap.hiver", "Plafond hiver (c€/kWh HT)"], ["cap.ete", "Plafond été (c€/kWh HT)"],
    ["conformite", "Conformité (c€/kWh HT)"], ["marge", "Marge fournisseur (c€/kWh HT)"],
    ["prime", "Prime / certificats (c€/kWh HT)"], ["tva", "TVA (multiplicateur, ex. 1.20)"]
];

const HC_INPUT_IDS = [
    ["bleuHC-start-endDay1", "bleuHC-end-endDay1"],
    ["bleuHC-start-beginDay2", "bleuHC-end-beginDay2"],
    ["bleuHC-start-middleDay2", "bleuHC-end-middleDay2"]
];

const byId = id => document.getElementById(id);

export function initCurrentOfferForm({ kvaSelector, simulateButton, offerApi }) {
    const enabled = byId("currentOfferEnabled");
    const fields = byId("currentOfferFields");
    const errorBox = byId("currentOfferError");
    const fileStatus = byId("currentOfferFileStatus");
    const structureSelect = byId("currentOfferStructure");
    const pricesBox = byId("currentOfferPrices");
    const spotBox = byId("currentOfferSpot");
    const windowEnabled = byId("currentOfferWindowEnabled");

    // Valeurs saisies par « type.bande », conservées quand la grille de prix est
    // reconstruite (changement de type d'offre ou de mode HP/HC).
    const priceMemory = {};
    let touched = false;

    buildWeekendDays();
    buildSpotFields();
    renderPrices();
    refresh();

    enabled.addEventListener("change", refresh);
    kvaSelector.addEventListener("change", refresh);
    [structureSelect, byId("currentOfferSeasonWeekend"), windowEnabled,
        ...document.querySelectorAll('input[name="currentOfferHours"]')]
        .forEach(el => el.addEventListener("change", () => { renderPrices(); refresh(); }));
    fields.addEventListener("input", event => {
        touched = true;
        if (event.target.dataset.type) {
            priceMemory[event.target.dataset.type + "." + event.target.dataset.band] = event.target.value;
        }
        refresh();
    });
    byId("currentOfferExport").addEventListener("click", exportOffer);
    byId("currentOfferImport").addEventListener("change", importOffer);

    function parseNumber(input) {
        return input.value.trim() === "" ? NaN : Number(input.value);
    }

    function buildWeekendDays() {
        const box = byId("currentOfferWeekendDays");
        for (const [label, day] of DAY_LABELS) {
            const wrapper = document.createElement("div");
            wrapper.className = "form-check form-check-inline";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = "form-check-input";
            input.id = "currentOfferDay" + day;
            input.value = String(day);
            input.checked = day === 0 || day === 6;
            const text = document.createElement("label");
            text.className = "form-check-label";
            text.htmlFor = input.id;
            text.textContent = label;
            wrapper.append(input, text);
            box.appendChild(wrapper);
        }
    }

    function buildSpotFields() {
        for (const [key, label] of SPOT_FIELDS) {
            const group = document.createElement("div");
            group.className = "mb-2 maxinput";
            const id = "currentOfferSpot-" + key;
            const text = document.createElement("label");
            text.className = "form-label small mb-0";
            text.htmlFor = id;
            text.textContent = label;
            const input = document.createElement("input");
            input.type = "number";
            input.className = "form-control form-control-sm";
            input.id = id;
            input.min = "0";
            input.step = "any";
            input.dataset.spot = key;
            group.append(text, input);
            spotBox.appendChild(group);
        }
        writeSpot(offerApi.defaultSpot);
    }

    function writeSpot(spot) {
        for (const input of spotBox.querySelectorAll("[data-spot]")) {
            const value = input.dataset.spot.split(".").reduce((o, k) => o?.[k], spot);
            input.value = Number.isFinite(value) ? String(value) : "";
        }
    }

    function readSpot() {
        const spot = { turpe: {}, cap: {} };
        for (const input of spotBox.querySelectorAll("[data-spot]")) {
            const [first, second] = input.dataset.spot.split(".");
            if (second) {
                spot[first][second] = parseNumber(input);
            } else {
                spot[first] = parseNumber(input);
            }
        }
        return spot;
    }

    function readWeekendDays() {
        return DAY_LABELS.map(([, day]) => day)
            .filter(day => byId("currentOfferDay" + day).checked);
    }

    function hoursMode() {
        return document.querySelector('input[name="currentOfferHours"]:checked').value;
    }

    // Modèle d'offre courant, lu depuis le formulaire (null si désactivé).
    function readOffer() {
        const structure = structureSelect.value;
        const offer = {
            name: byId("currentOfferName").value,
            kva: Number(kvaSelector.value),
            abonnement: parseNumber(byId("currentOfferAbonnement")),
            structure: structure,
            hours: hoursMode(),
            weekendDays: readWeekendDays(),
            seasonWeekend: byId("currentOfferSeasonWeekend").checked,
            window: structure === "unique" && windowEnabled.checked
                ? { fromHour: parseNumber(byId("currentOfferWindowFrom")), toHour: parseNumber(byId("currentOfferWindowTo")) }
                : null,
            prices: {},
            spot: readSpot(),
            hcRanges: HC_INPUT_IDS.map(([start, end]) => [byId(start).value, byId(end).value])
        };
        for (const input of pricesBox.querySelectorAll("[data-type]")) {
            const { type, band } = input.dataset;
            const value = parseNumber(input);
            if (band === "price") {
                offer.prices[type] = value;
            } else {
                offer.prices[type] = { ...offer.prices[type], [band]: value };
            }
        }
        return offer;
    }

    // Grille de prix : une ligne par type de jour, une ou deux colonnes (HP/HC).
    function renderPrices() {
        const offer = readOffer();
        pricesBox.innerHTML = "";
        const types = offerApi.dayTypesOf(offer);
        for (const type of types) {
            const row = document.createElement("div");
            row.className = "mb-2";
            const title = document.createElement("div");
            title.className = "form-label mb-1";
            title.textContent = typeLabel(type, offer.structure);
            row.appendChild(title);
            const bands = offer.hours === "hphc" && type !== "hsc"
                ? [["HP", "Heures pleines"], ["HC", "Heures creuses"]]
                : [["price", "Prix du kWh"]];
            const line = document.createElement("div");
            line.className = "d-flex flex-wrap gap-2";
            for (const [band, label] of bands) {
                const id = "currentOfferPrice-" + type + "-" + band;
                const wrapper = document.createElement("div");
                wrapper.className = "input-group maxinput";
                const input = document.createElement("input");
                input.type = "number";
                input.className = "form-control";
                input.id = id;
                input.min = "0";
                input.step = "0.0001";
                input.inputMode = "decimal";
                input.placeholder = "€ TTC / kWh";
                input.setAttribute("aria-label", typeLabel(type, offer.structure) + " – " + label + " (€ TTC / kWh)");
                input.dataset.type = type;
                input.dataset.band = band;
                input.value = priceMemory[type + "." + band] ?? "";
                const addon = document.createElement("span");
                addon.className = "input-group-text";
                addon.textContent = bands.length > 1 ? label : "€/kWh";
                wrapper.append(input, addon);
                line.appendChild(wrapper);
            }
            row.appendChild(line);
            pricesBox.appendChild(row);
        }
    }

    function typeLabel(type, structure) {
        const entry = TYPE_LABELS[type];
        return typeof entry === "string" ? entry : (entry?.[structure] ?? type);
    }

    // Visibilité des blocs selon le type d'offre, puis validation.
    function refresh() {
        const on = enabled.checked;
        const structure = structureSelect.value;
        const isSpot = structure === "spot";
        const hours = hoursMode();
        const show = (id, visible) => byId(id).classList.toggle("d-none", !visible);
        show("currentOfferFields", on);
        show("currentOfferHoursRow", !isSpot);
        show("currentOfferSeasonWeekendRow", structure === "season");
        show("currentOfferWeekendDaysRow", structure === "weekend"
            || (structure === "season" && byId("currentOfferSeasonWeekend").checked));
        show("currentOfferWindowRow", structure === "unique");
        show("currentOfferWindowFields", structure === "unique" && windowEnabled.checked);
        show("currentOfferPrices", !isSpot);
        show("currentOfferSpot", isSpot);
        show("currentOfferHCHint", !isSpot && hours === "hphc");

        const error = on ? offerApi.validate(readOffer(), Number(kvaSelector.value)) : null;
        simulateButton.disabled = error !== null;
        errorBox.textContent = error ?? "";
        errorBox.classList.toggle("d-none", error === null || !touched);
    }

    function setStatus(message, isError) {
        fileStatus.textContent = message;
        fileStatus.classList.toggle("text-danger", isError);
        fileStatus.classList.toggle("text-success", !isError);
    }

    function slug(text) {
        return text.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    function exportOffer() {
        const offer = readOffer();
        const blob = new Blob([offerApi.serialize(offer)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "offre-" + (slug(offer.name) || "actuelle") + ".json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        setStatus("Offre exportée.", false);
    }

    function importOffer(event) {
        const file = event.target.files[0];
        event.target.value = "";
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                writeOffer(offerApi.parse(String(reader.result)));
                setStatus("Offre « " + (file.name) + " » importée.", false);
            } catch (error) {
                setStatus(error.message, true);
            }
        };
        reader.onerror = () => setStatus("Lecture du fichier impossible.", true);
        reader.readAsText(file);
    }

    function writeOffer(offer) {
        enabled.checked = true;
        touched = true;
        byId("currentOfferName").value = offer.name;
        byId("currentOfferAbonnement").value = Number.isFinite(offer.abonnement) ? String(offer.abonnement) : "";
        structureSelect.value = offer.structure;
        byId(offer.hours === "hphc" ? "currentOfferHoursHPHC" : "currentOfferHoursSingle").checked = true;
        byId("currentOfferSeasonWeekend").checked = offer.seasonWeekend;
        for (const [, day] of DAY_LABELS) {
            byId("currentOfferDay" + day).checked = offer.weekendDays.includes(day);
        }
        windowEnabled.checked = offer.window !== null;
        if (offer.window) {
            byId("currentOfferWindowFrom").value = String(offer.window.fromHour);
            byId("currentOfferWindowTo").value = String(offer.window.toHour);
        }
        writeSpot(offer.spot);

        for (const key of Object.keys(priceMemory)) {
            delete priceMemory[key];
        }
        for (const [type, value] of Object.entries(offer.prices)) {
            if (value !== null && typeof value === "object") {
                for (const [band, number] of Object.entries(value)) {
                    priceMemory[type + "." + (band === "HP" || band === "HC" ? band : "price")] = String(number);
                }
            } else if (value !== null && value !== undefined) {
                priceMemory[type + ".price"] = String(value);
            }
        }
        renderPrices();

        // Puissance et plages HC voyagent avec le fichier : ce sont des réglages
        // des étapes 1 et 2, dont le prix de l'offre dépend.
        if (offer.kva && [...kvaSelector.options].some(o => Number(o.value) === offer.kva)) {
            kvaSelector.value = String(offer.kva);
        }
        if (offer.hcRanges) {
            HC_INPUT_IDS.forEach(([start, end], i) => {
                const range = offer.hcRanges[i];
                if (Array.isArray(range) && /^\d{2}:\d{2}$/.test(range[0]) && /^\d{2}:\d{2}$/.test(range[1])) {
                    byId(start).value = range[0];
                    byId(end).value = range[1];
                }
            });
        }
        refresh();
    }

    return { read: () => (enabled.checked ? readOffer() : null) };
}
