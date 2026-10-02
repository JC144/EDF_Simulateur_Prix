import { viewManager } from './ui/viewManager.js';
import { initImportView } from './ui/importView.js';
import { initResultsView } from './ui/resultsView.js';
import { runSimulation } from './core/simulation.js';
import { sumPeriod } from './core/calculator.js';
import { loadTarifs } from './core/tarifsRegistry.js';

viewManager.init();

// L'agrégation par période est injectée : les modules ui/ ne dépendent pas de core/.
const resultsView = initResultsView({ sumPeriod });

// Les scripts de tarifs (~440 Ko, ~150 Ko gzip, données spot comprises) ne sont pas chargés
// avec l'accueil : leur téléchargement démarre à l'entrée dans l'assistant,
// pendant que l'utilisateur importe son CSV, et Simuler l'attend au besoin.
function preloadTarifs() {
    loadTarifs().catch(function (error) {
        console.error(error);
    });
}

const importView = initImportView({
    onStart: function () {
        preloadTarifs();
        viewManager.show("import");
        history.pushState({ view: "import", step: 1 }, "");
    },
    onStepForward: function (step) {
        history.pushState({ view: "import", step: step }, "");
    },
    onSimulate: async function (settings, data) {
        try {
            await loadTarifs();
        } catch (error) {
            console.error(error);
            alert("Les tarifs n'ont pas pu être chargés. Vérifiez votre connexion puis rechargez la page.");
            return;
        }
        const simulation = runSimulation(settings, data);
        viewManager.show("prices");
        resultsView.show(simulation);
        history.pushState({ view: "prices" }, "");
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
    const state = event.state || { view: "presentation" };
    if (state.view === "prices") {
        viewManager.show("prices");
    } else if (state.view === "import") {
        preloadTarifs();
        viewManager.show("import");
        importView.goToStep(state.step || 1);
    } else {
        viewManager.show("presentation");
    }
});
