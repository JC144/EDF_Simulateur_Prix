// Métadonnées partagées des pages de grille tarifaire (tarifs/<slug>.html) :
// utilisé par le navigateur (resultsRenderer, tarif-page.js) ET par le
// générateur Node (import/tools/gen-tarif-pages.mjs). ES pur, aucun import.

// "EDF - Bleu Heures Creuses" -> "edf-bleu-heures-creuses". Dérivé du NOM du
// tarif, jamais du fichier (un fichier peut déclarer plusieurs tarifs).
export function tarifSlug(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Chemin relatif à la racine du site (href depuis index.html).
export function tarifPagePath(name) {
    return "tarifs/" + tarifSlug(name) + ".html";
}

// Au-delà de cet âge, une grille est signalée comme à vérifier.
export const STALE_MONTHS = 6;

// lastUpdate "AAAA-MM-JJ". Vrai si today est strictement postérieur à
// lastUpdate + STALE_MONTHS mois (calcul en UTC ; Date.UTC reporte les jours
// en trop : 31 août + 6 mois = 3 mars).
export function isStale(lastUpdate, today = new Date()) {
    const [y, m, d] = lastUpdate.split("-").map(Number);
    const limit = Date.UTC(y, m - 1 + STALE_MONTHS, d);
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return todayUtc > limit;
}
