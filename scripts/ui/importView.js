import { selectParser } from '../parsers/index.js';
import { createWizard } from './wizard.js';
import { initEnedisSnippetBox } from './enedisSnippetBox.js';
import { initCurrentOfferForm } from './currentOfferForm.js';

// Écran d'import : réglages (puissance, jour Zen+, heures creuses, tarifs
// communautaires) et chargement du fichier CSV. Détient les données parsées
// jusqu'au lancement de la simulation.
export function initImportView({ onStart, onStepForward, onSimulate, offerApi }) {
    let data = [];

    const csvFile = document.getElementById("csvFile");
    const kvaSelector = document.getElementById("puissanceSouscrite");
    const jourZenPlusSelector = document.getElementById("jourZenPlus");
    const simulateButton = document.getElementById("simulateButton");
    const importError = document.getElementById("importError");

    // Wizard 4 étapes : 1 puissance, 2 jour Zen+ / heures creuses, 3 données
    // Linky, 4 tarifs communautaires + simulation.
    const wizard = createWizard({
        steps: [1, 2, 3, 4].map(n => document.getElementById("wizardStep" + n)),
        stepper: document.getElementById("wizardStepper"),
        nextButton: document.getElementById("wizardNextButton"),
        finalActionButton: simulateButton,
        onNext: (step) => {
            closeHelperAccordion();
            onStepForward(step);
        }
    });

    // Les étapes sont superposées (grid + visibility) : l'accordéon d'aide de
    // l'étape 3 laissé ouvert gonflerait la hauteur des écrans suivants.
    function closeHelperAccordion() {
        const collapse = bootstrap.Collapse.getInstance(document.getElementById("accordionHelperContainer"));
        if (collapse) {
            collapse.hide();
        }
    }
    // L'étape Linky exige un import CSV valide avant de continuer.
    wizard.setStepValid(3, false);

    // Onglet « Depuis Enedis (automatique) » : script d'export à copier.
    initEnedisSnippetBox();

    ["bleuHC-start-endDay1", "bleuHC-end-endDay1",
        "bleuHC-start-beginDay2", "bleuHC-end-beginDay2",
        "bleuHC-start-middleDay2", "bleuHC-end-middleDay2"]
        .forEach(id => document.getElementById(id).addEventListener("change", bleuHCRangeChanged));

    csvFile.addEventListener("change", onFileImported);
    importError.style.display = "none";

    // Dropzone : le drag & drop alimente #csvFile puis rejoue le pipeline
    // d'import via l'événement change.
    const dropzone = document.getElementById("csvDropzone");
    const csvFileName = document.getElementById("csvFileName");
    ["dragover", "dragenter"].forEach(type => dropzone.addEventListener(type, function (e) {
        e.preventDefault();
        dropzone.classList.add("dragover");
    }));
    ["dragleave", "dragend"].forEach(type => dropzone.addEventListener(type, function () {
        dropzone.classList.remove("dragover");
    }));
    dropzone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            csvFile.files = e.dataTransfer.files;
            csvFile.dispatchEvent(new Event("change"));
        }
    });

    document.getElementById("startButton").onclick = function () {
        wizard.goTo(1);
        onStart();
    };
    simulateButton.onclick = function () {
        onSimulate(buildSettings(getSelectedTypeOfPrice()), data);
    };

    const currentOfferForm = initCurrentOfferForm({ kvaSelector, simulateButton, offerApi });

    function buildSettings(includeCommunity) {
        return {
            kva: Number(kvaSelector.value),
            jourZenPlus: parseInt(jourZenPlusSelector.value),
            hcRawRanges: [
                ["bleuHC-start-endDay1", "bleuHC-end-endDay1"],
                ["bleuHC-start-beginDay2", "bleuHC-end-beginDay2"],
                ["bleuHC-start-middleDay2", "bleuHC-end-middleDay2"]
            ].map(([startId, endId]) => [
                document.getElementById(startId).value,
                document.getElementById(endId).value
            ]),
            includeCommunity: includeCommunity,
            currentOffer: currentOfferForm.read()
        };
    }

    function getSelectedTypeOfPrice() {
        return document.querySelector('input[name="communityPricesRadio"]:checked').value == 'isCommunity';
    }

    function setDropzoneFile(name) {
        dropzone.classList.toggle("has-file", name !== null);
        csvFileName.classList.toggle("d-none", name === null);
        csvFileName.textContent = name === null ? "" : name;
    }

    function bleuHCRangeChanged(e) {
        //If it's a start, we need to check if the end is after the start
        if (e.target.id.includes("start")) {
            const end = document.getElementById(e.target.id.replace("start", "end"));
            const selectedTime = e.target.value.split(":");
            const selectedHours = parseInt(selectedTime[0]);
            const selectedMinutes = parseInt(selectedTime[1]);
            const endTime = end.value.split(":");
            const endHours = parseInt(endTime[0]);
            const endMinutes = parseInt(endTime[1]);
            if (selectedHours > endHours || (selectedHours == endHours && selectedMinutes > endMinutes)) {
                end.value = e.target.value;
            }
        }
        else if (e.target.id.includes("end")) {
            const start = document.getElementById(e.target.id.replace("end", "start"));
            const selectedTime = e.target.value.split(":");
            const selectedHours = parseInt(selectedTime[0]);
            const selectedMinutes = parseInt(selectedTime[1]);
            const startTime = start.value.split(":");
            const startHours = parseInt(startTime[0]);
            const startMinutes = parseInt(startTime[1]);
            if (selectedHours < startHours || (selectedHours == startHours && selectedMinutes < startMinutes)) {
                start.value = e.target.value;
            }
        }
    }

    function onFileImported(e) {
        e.preventDefault();
        const input = csvFile.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            importError.style.display = "none";

            const parser = selectParser(csvFile.files[0].name);
            const text = e.target.result;
            try {
                let rawCSV = parser.parseCSV(text);
                data = parser.loadData(rawCSV);
                wizard.setStepValid(3, true);
                setDropzoneFile(csvFile.files[0].name);
            }
            catch (e) {
                importError.style.display = "block";
                wizard.setStepValid(3, false);
                setDropzoneFile(null);
            }
        };
        reader.readAsText(input);
    }

    // Application d'une étape depuis l'historique navigateur (popstate) :
    // navigation directe, sans pousser de nouvelle entrée.
    return { goToStep: (n) => wizard.goTo(n) };
}
