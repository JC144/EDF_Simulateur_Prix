import { getTarifBuilder } from './tarifsRegistry.js';

// Offre actuelle de l'utilisateur : saisie dans l'assistant, comparée aux grilles.
// Le modèle de saisie (« offre ») est du JSON pur, exportable/importable tel quel :
//   { format, version, name, kva, abonnement (€/mois TTC),
//     structure: "unique" | "weekend" | "tempo" | "ejp" | "season" | "spot",
//     hours: "single" | "hphc",          // prix unique ou HP/HC (ignoré en spot)
//     weekendDays: [0..6],               // weekend + saison avec week-end (0 = dimanche)
//     seasonWeekend: boolean,            // saison : tarif propre au week-end
//     window: null | { fromHour, toHour },  // fenêtre super creuse (unique), prix dans prices.hsc
//     prices: { <type de jour>: number | { HP, HC } },   // €/kWh TTC
//     spot: { turpe: {hiver, ete}, accise, cap: {hiver, ete}, conformite, marge,
//             prime, tva },              // centimes/kWh HT, tva = multiplicateur
//     hcRanges: [[début, fin], ...] }    // plages HC de l'étape « Heures creuses »
// Il est converti en définition defineTarif (voir offerToDef) puis construit par
// window.buildTarif, qui valide : toutes les règles du moteur s'appliquent.

export const CURRENT_OFFER_TITLE = "Mon offre actuelle";
export const OFFER_FORMAT = "edf-simulateur-offre";
export const OFFER_VERSION = 1;

// Évolution du format : quand OFFER_VERSION passe de N à N+1, ajouter ici
// MIGRATIONS[N] = raw => ({ ...raw, version: N + 1, <champs adaptés> }). Les
// fichiers plus anciens sont relus en enchaînant les migrations ; les fichiers
// plus récents que l'application sont refusés avec un message explicite.
const MIGRATIONS = {};

// Exportée pour les tests (migrations injectables).
export function migrateOffer(raw, migrations = MIGRATIONS, currentVersion = OFFER_VERSION) {
    if (!Number.isInteger(raw.version) || raw.version < 1) {
        throw new Error("Version de fichier invalide : " + raw.version);
    }
    if (raw.version > currentVersion) {
        throw new Error("Ce fichier a été créé par une version plus récente du simulateur (format v"
            + raw.version + ", cette version lit jusqu'à v" + currentVersion + ").");
    }
    let migrated = raw;
    for (let v = raw.version; v < currentVersion; v++) {
        if (!migrations[v]) {
            throw new Error("Format v" + v + " non pris en charge.");
        }
        migrated = migrations[v](migrated);
    }
    return migrated;
}

export const STRUCTURES = ["unique", "weekend", "tempo", "ejp", "season", "spot"];

// Valeurs par défaut de la formule spot (grille Sobry SoCap, centimes/kWh).
export const DEFAULT_SPOT = {
    turpe: { hiver: 6.32, ete: 1.49 },
    accise: 3.085,
    cap: { hiver: 25.0, ete: 14.17 },
    conformite: 1.0,
    marge: 0.8,
    prime: 0.7,
    tva: 1.2
};

// Types de jour à tarifer (ordre d'affichage) pour une offre.
export function dayTypesOf(offer) {
    switch (offer.structure) {
        case "weekend": return ["base", "weekend"];
        case "tempo": return ["bleu", "blanc", "rouge"];
        case "ejp": return ["bleu", "rouge"];
        case "season":
            return offer.seasonWeekend ? ["hiver", "hiverWeekend", "ete", "eteWeekend"] : ["hiver", "ete"];
        case "unique":
            return offer.window ? ["base", "hsc"] : ["base"];
        default: return [];
    }
}

// Un type « fenêtre horaire » (hsc) n'a qu'un prix, même en HP/HC.
function isSinglePriced(offer, type) {
    return offer.hours !== "hphc" || type === "hsc";
}

const toCentimes = euros => Math.round(euros * 1e6) / 1e4;

function priceSpec(offer, type) {
    const value = offer.prices?.[type];
    if (isSinglePriced(offer, type)) {
        return { price: toCentimes(typeof value === "object" ? value?.price ?? value?.HP : value) };
    }
    return { HP: toCentimes(value?.HP), HC: toCentimes(value?.HC) };
}

const MONTHS_WINTER = [11, 12, 1, 2, 3];
const MONTHS_SUMMER = [4, 5, 6, 7, 8, 9, 10];

// Définition defineTarif (centimes/kWh) d'une offre saisie.
export function offerToDef(offer, kva) {
    const def = {
        name: offerTitle(offer),
        offer_type: "Perso",
        lastUpdate: new Date().toISOString().slice(0, 10),
        isCommunity: true,
        subscription_url: "",
        price_url: "https://comparateur-abonnements-electricite.fr",
        subscriptions: { [kva]: Number(offer.abonnement) }
    };

    if (offer.structure === "spot") {
        def.dayRule = { type: "spot", source: "epex-fr" };
        def.spotFormula = offer.spot;
        return def;
    }

    def.dayTypes = {};
    for (const type of dayTypesOf(offer)) {
        def.dayTypes[type] = priceSpec(offer, type);
    }

    switch (offer.structure) {
        case "unique":
            def.dayRule = { type: "constant", dayType: "base" };
            if (offer.window) {
                def.dayRule.hourSubTypes = [{
                    fromHour: Number(offer.window.fromHour),
                    toHour: Number(offer.window.toHour),
                    dayType: "hsc"
                }];
            }
            break;
        case "weekend":
            def.dayRule = { type: "weekly", default: "base", days: { weekend: offer.weekendDays } };
            break;
        case "tempo":
            def.dayRule = { type: "calendar", default: "bleu", calendar: "tempo-edf", previousDayBefore: 6 };
            break;
        case "ejp":
            def.dayRule = { type: "calendar", default: "bleu", calendar: "ejp-edf" };
            break;
        case "season": {
            const seasons = {
                hiver: { months: MONTHS_WINTER },
                ete: { months: MONTHS_SUMMER }
            };
            if (offer.seasonWeekend) {
                seasons.hiver.weekendType = "hiverWeekend";
                seasons.ete.weekendType = "eteWeekend";
            }
            def.dayRule = { type: "season", seasons: seasons };
            if (offer.seasonWeekend) {
                def.dayRule.weekendDays = offer.weekendDays;
            }
            break;
        }
    }

    // HP/HC : plages de l'étape « Heures creuses » (hasHCCustom).
    if (offer.hours === "hphc") {
        def.hcRanges = "custom";
    }
    return def;
}

function offerTitle(offer) {
    const label = typeof offer.name === "string" ? offer.name.trim() : "";
    return label ? CURRENT_OFFER_TITLE + " (" + label + ")" : CURRENT_OFFER_TITLE;
}

// Abonnement au contrat du calculateur (voir tarifsRegistry / define-tarif).
// Lève une Error (message en français) si l'offre est invalide.
export function buildCurrentOfferAbonnement(offer, kva) {
    const build = getTarifBuilder();
    if (!build) {
        throw new Error("Les tarifs ne sont pas encore chargés.");
    }
    return build(offerToDef(offer, kva), { silent: true });
}

// Message d'erreur lisible, ou null si l'offre est valide.
export function validateCurrentOffer(offer, kva) {
    if (!allNumbersFilled(offer)) {
        return "Renseignez l'abonnement et tous les prix de votre offre (nombres positifs).";
    }
    try {
        buildCurrentOfferAbonnement(offer, kva);
        return null;
    } catch (error) {
        const first = String(error.message).split("\n")[0];
        return first.replace(/^defineTarif\("[^"]*"\) : /, "");
    }
}

function allNumbersFilled(offer) {
    const isNum = v => typeof v === "number" && Number.isFinite(v) && v >= 0;
    if (!isNum(offer.abonnement)) {
        return false;
    }
    if (offer.structure === "spot") {
        const s = offer.spot ?? {};
        return [s.turpe?.hiver, s.turpe?.ete, s.accise, s.cap?.hiver, s.cap?.ete,
            s.conformite, s.marge, s.prime, s.tva].every(isNum);
    }
    return dayTypesOf(offer).every(type => {
        const value = offer.prices?.[type];
        return isSinglePriced(offer, type)
            ? isNum(typeof value === "object" ? value?.price : value)
            : isNum(value?.HP) && isNum(value?.HC);
    }) && (!offer.window || [offer.window.fromHour, offer.window.toHour].every(isNum));
}

// --- Export / import -------------------------------------------------------

export function serializeOffer(offer) {
    return JSON.stringify({ format: OFFER_FORMAT, version: OFFER_VERSION, ...offer }, null, 2);
}

// Relit un fichier d'offre. Lève une Error si le format est inconnu ou le
// contenu mal formé ; la validité tarifaire est vérifiée à part (validateCurrentOffer).
export function parseOffer(text) {
    let raw;
    try {
        raw = JSON.parse(text);
    } catch {
        throw new Error("Fichier illisible : ce n'est pas du JSON.");
    }
    if (raw === null || typeof raw !== "object" || raw.format !== OFFER_FORMAT) {
        throw new Error("Ce fichier n'est pas une offre exportée par ce simulateur.");
    }
    raw = migrateOffer(raw);
    if (!STRUCTURES.includes(raw.structure)) {
        throw new Error("Type d'offre inconnu : " + raw.structure);
    }
    const days = Array.isArray(raw.weekendDays) ? raw.weekendDays.filter(d => Number.isInteger(d) && d >= 0 && d <= 6) : [0, 6];
    return {
        name: typeof raw.name === "string" ? raw.name.slice(0, 60) : "",
        kva: Number.isFinite(Number(raw.kva)) ? Number(raw.kva) : null,
        abonnement: Number.isFinite(raw.abonnement) ? raw.abonnement : NaN,
        structure: raw.structure,
        hours: raw.hours === "hphc" ? "hphc" : "single",
        weekendDays: days.length > 0 ? days : [0, 6],
        seasonWeekend: raw.seasonWeekend === true,
        window: raw.window && typeof raw.window === "object"
            ? { fromHour: Number(raw.window.fromHour), toHour: Number(raw.window.toHour) }
            : null,
        prices: raw.prices && typeof raw.prices === "object" ? raw.prices : {},
        spot: raw.spot && typeof raw.spot === "object" ? raw.spot : structuredClone(DEFAULT_SPOT),
        hcRanges: Array.isArray(raw.hcRanges) ? raw.hcRanges : null
    };
}
