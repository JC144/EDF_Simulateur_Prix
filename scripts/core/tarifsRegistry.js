import { TARIF_CATALOGUE } from '../tarifs-catalogue.js';
import { isEdfOffer } from '../utils/tarifMeta.js';

// Seul point de contact avec le registre global rempli par les scripts
// classiques de scripts/tarifs/** (voir scripts/tarifs-registry.js).
// Quand les tarifs seront refactorés en modules, seul ce fichier changera.
export function getAbonnements() {
    return window.abonnements ?? [];
}

export function getAvailableAbonnements(kva) {
    const puissance = Number(kva);
    return getAbonnements().filter(abo => abo.prices.some(p => p.puissance === puissance));
}

export function getAvailablePowers() {
    const powers = TARIF_CATALOGUE.flatMap(offer => offer.powers);
    return [...new Set(powers)].sort((a, b) => a - b);
}

export function getOfferChoices(kva) {
    return TARIF_CATALOGUE.filter(offer => offer.powers.includes(Number(kva)));
}

export function offersForComparison(offers, settings) {
    return offers.filter(offer => (settings.includeCommunity || isEdfOffer(offer.name))
        && (!offer.eligibility || offer.name === settings.currentOffer));
}

// Racine du site, déduite de l'emplacement de ce module (scripts/core/).
const ROOT = new URL('../../', import.meta.url);

const scripts = new Map();

function loadScript(file) {
    if (!scripts.has(file)) {
        scripts.set(file, new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = new URL(file, ROOT).href;
            script.async = false;
            script.onload = resolve;
            script.onerror = () => {
                scripts.delete(file);
                script.remove();
                reject(new Error("Échec du chargement de " + file));
            };
            document.head.appendChild(script);
        }));
    }
    return scripts.get(file);
}

export async function loadTarifs(settings) {
    const { TARIF_LIBRARIES, TARIF_CALENDARS, TARIF_SPOT_SERIES } = await import('../tarifs-manifest.js');
    const offers = offersForComparison(getOfferChoices(settings.kva), settings);
    const files = new Set(offers.map(offer => offer.file));
    const usesSpot = offers.some(offer => offer.usesSpot);

    // Une étape doit réussir avant d'exécuter ses dépendants. Un nouvel
    // essai peut ainsi reprendre après une coupure sans redéfinir de tarif.
    await Promise.all(TARIF_LIBRARIES.map(loadScript));
    const dataFiles = usesSpot ? [...TARIF_CALENDARS, ...TARIF_SPOT_SERIES] : TARIF_CALENDARS;
    await Promise.all(dataFiles.map(loadScript));
    await Promise.all([...files].map(loadScript));

    const byName = new Map(getAbonnements().map(abo => [abo.name, abo]));
    return offers.map(({ name }) => {
        if (!byName.has(name)) throw new Error("Grille tarifaire absente : " + name);
        return byName.get(name);
    });
}
