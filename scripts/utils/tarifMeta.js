// Métadonnées partagées des pages de grille tarifaire (tarifs/<slug>.html) :
// utilisé par le navigateur (resultsRenderer, tarif-page.js) ET par le
// générateur Node (import/tools/gen-tarif-pages.mjs). ES pur, aucun import.

export function isEdfOffer(name) {
    return name.startsWith("EDF - ");
}

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

const parisDay = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" });

export function todayInParis(date = new Date()) {
    return parisDay.format(date);
}

export function isSubscriptionDisabled(rule, today = todayInParis()) {
    if (rule?.kind === "closed") return true;
    if (rule?.kind !== "expired") return false;
    return rule.endInclusive ? today > rule.endDate : today >= rule.endDate;
}

export function subscriptionBadgeLabel(rule) {
    return rule.kind === "closed" ? "Fermée à la souscription" : "Souscription close pour cette grille";
}

// lastUpdate "AAAA-MM-JJ". Vrai si today est strictement postérieur à
// lastUpdate + STALE_MONTHS mois (calcul en UTC ; Date.UTC reporte les jours
// en trop : 31 août + 6 mois = 3 mars).
export function isStale(lastUpdate, today = new Date()) {
    const [y, m, d] = lastUpdate.split("-").map(Number);
    const limit = Date.UTC(y, m - 1 + STALE_MONTHS, d);
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return todayUtc > limit;
}
