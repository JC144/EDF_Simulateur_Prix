import { TARIF_SCRIPTS } from '../tarifs-manifest.js';

// Seul point de contact avec le registre global rempli par les scripts
// classiques de scripts/tarifs/** (voir scripts/tarifs-registry.js).
// Quand les tarifs seront refactorés en modules, seul ce fichier changera.
export function getAbonnements() {
    return window.abonnements ?? [];
}

// Racine du site, déduite de l'emplacement de ce module (scripts/core/).
const ROOT = new URL('../../', import.meta.url);

let loading = null;

// Charge les scripts de tarifs (une seule fois, promesse partagée). Insérés
// dynamiquement avec async = false, ils s'exécutent dans l'ordre du manifeste
// tout en se téléchargeant en parallèle. Pas de nouvel essai après un échec :
// rejouer les scripts déjà exécutés lèverait des « déjà défini » dans
// define-tarif.js, seul un rechargement de la page remet un état propre.
export function loadTarifs() {
    if (!loading) {
        loading = Promise.all(TARIF_SCRIPTS.map(function (rel) {
            return new Promise(function (resolve, reject) {
                const script = document.createElement("script");
                script.src = new URL(rel, ROOT).href;
                script.async = false;
                script.onload = resolve;
                script.onerror = function () {
                    reject(new Error("Échec du chargement de " + rel));
                };
                document.head.appendChild(script);
            });
        }));
    }
    return loading;
}
