import { viewManager } from './ui/viewManager.js';
import { initImportView } from './ui/importView.js';
import { initResultsView } from './ui/resultsView.js';
import { sumPeriod } from './core/calculator.js';
import { getOfferChoices, getAvailablePowers, loadTarifs } from './core/tarifsRegistry.js';

viewManager.init();

// L'agrégation par période est injectée : les modules ui/ ne dépendent pas de core/.
const resultsView = initResultsView({ sumPeriod, onRetry: showPrices });
let pendingCalculation = null;
let calculationId = 0;

async function showPrices() {
    viewManager.show("prices");
    if (!pendingCalculation) return; // Avancer vers un classement déjà calculé.

    const id = ++calculationId;
    const { settings, data } = pendingCalculation;
    let errorMessage = "Le chargement des tarifs a échoué. Vérifiez votre connexion.";
    try {
        const [offers, { simulateOffers }] = await Promise.all([
            loadTarifs(settings), import('./core/simulation.js'), resultsView.start()
        ]);
        if (id !== calculationId) return;
        errorMessage = "Le calcul des tarifs a échoué.";
        const steps = simulateOffers(settings, data, offers);
        let nextUpdate = 0;
        let step = steps.next();
        while (!step.done) {
            if (performance.now() >= nextUpdate) {
                resultsView.progress(step.value);
                await new Promise(resolve => setTimeout(resolve, 0));
                if (id !== calculationId) return;
                nextUpdate = performance.now() + 50;
            }
            step = steps.next();
        }
        resultsView.show(step.value, offers.length);
        pendingCalculation = null;
    } catch (error) {
        if (id !== calculationId) return;
        console.error(error);
        resultsView.showError(errorMessage);
    }
}

const importView = initImportView({
    getOfferChoices,
    getAvailablePowers,
    onStart: function () {
        viewManager.show("import");
        history.pushState({ view: "import", step: 1 }, "");
    },
    onStepForward: function (step) {
        history.pushState({ view: "import", step: step }, "");
    },
    onSimulate: function (settings, data) {
        pendingCalculation = { settings, data };
        history.pushState({ view: "prices" }, "");
        showPrices();
    }
});

// Le bouton Démarrer de la nav sticky relaie le CTA du héro (pas de handler
// inline : la CSP n'autorise que script-src 'self').
document.getElementById("navStartButton").addEventListener("click", function () {
    document.getElementById("startButton").click();
});

// Les CTA des pages de grille (tarifs/*.html) pointent vers « #simulateur » :
// l'assistant d'import s'ouvre directement. Le hash est retiré d'abord, pour
// que Retour ramène à l'accueil sans relancer l'assistant.
if (location.hash === "#simulateur") {
    history.replaceState(null, "", location.pathname + location.search);
    document.getElementById("startButton").click();
}

// Le Retour navigateur remplace le bouton Précédent : chaque avancée (Commencer,
// Suivant, Simuler) pousse une entrée {view, step} et popstate ré-applique l'état.
// Les vues ne sont jamais détruites : Retour/Avancer conservent réglages et CSV.
window.addEventListener("popstate", function (event) {
    calculationId++; // Un calcul quitté ne doit plus toucher à la vue.
    const state = event.state || { view: "presentation" };
    if (state.view === "prices") {
        showPrices();
    } else if (state.view === "import") {
        viewManager.show("import");
        importView.goToStep(state.step || 1);
    } else {
        viewManager.show("presentation");
    }
});
