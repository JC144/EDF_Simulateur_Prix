// Page de grille tarifaire (tarifs/*.html, générée) : affiche l'avertissement
// « grille de plus de 6 mois ». Calculé ici, au chargement, et non par le
// générateur : la page statique reste identique d'un jour à l'autre.
import { isStale } from "./utils/tarifMeta.js";

const page = document.querySelector("[data-last-update]");
const warning = document.querySelector(".tarif-stale");
if (page && warning) {
    warning.hidden = !isStale(page.dataset.lastUpdate);
}
