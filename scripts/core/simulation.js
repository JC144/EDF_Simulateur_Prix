import { computeMonths } from './calculator.js';
import { getAvailableAbonnements } from './tarifsRegistry.js';
import { isEdfOffer } from '../utils/tarifMeta.js';

// Lance la simulation complète : pour chaque abonnement compatible, applique
// les réglages utilisateur sur une vue résolue (le registre n'est jamais muté,
// une re-simulation part donc toujours de la grille d'origine) puis calcule
// les agrégats mensuels.
// settings : { kva, jourZenPlus, hcRawRanges, includeCommunity, currentOffer }
export function runSimulation(settings, data) {
    const calculatedMonths = calculateAllMonths(settings, data);
    const yearsAvailable = [...new Set(calculatedMonths[0].allMonths.map(m => m.year))].sort((a, b) => a - b);
    return { calculatedMonths, yearsAvailable, currentOffer: settings.currentOffer };
}

// Copie superficielle suffisante : le calculateur appelle getDayType avec la
// grille en receveur, et seules les règles weekly/calendar lisent
// this.specialDays — la copie résolue porte la personnalisation.
function resolveAbonnement(abo, settings) {
    const resolved = { ...abo };
    if (abo.hasSpecialDaysCustom) {
        resolved.specialDays = [...abo.specialDays, settings.jourZenPlus];
    }
    if (abo.hasHCCustom) {
        resolved.hc = buildHCRanges(settings.hcRawRanges);
    }
    return resolved;
}

// Vue résolue étroite consommée par le calculateur (voir calculator.js) :
// la dépendance des getDayType à this est contenue ici (bind sur la grille).
function resolveView(resolved, kva) {
    return {
        plan: resolved.prices.find(p => p.puissance === kva),
        getDayType: resolved.getDayType.bind(resolved),
        // Priorité aux plages du type de jour, sinon plages communes de la grille.
        hcRangesFor: dayType => resolved.hcByDayType?.[dayType] ?? resolved.hc,
        // Tarifs spot : prix du kWh par créneau (voir calculator.js).
        spotPricesFor: resolved.spotPricesFor ?? null
    };
}

function calculateAllMonths(settings, data) {
    // Défense en profondeur : les puissances des grilles sont des numbers
    // (garanti par defineTarif), on normalise le réglage au même type.
    const kva = Number(settings.kva);
    let filteredAbonnements = getAvailableAbonnements(kva);
    if (!settings.includeCommunity) {
        filteredAbonnements = filteredAbonnements.filter(a => isEdfOffer(a.name));
    }
    return filteredAbonnements.map(abo => {
        const resolved = resolveAbonnement(abo, settings);
        return {
            allMonths: computeMonths(resolveView(resolved, kva), data),
            title: abo.name,
            lastUpdate: abo.lastUpdate,
            subscription_url: abo.subscription_url,
            offer_type: abo.offer_type,
            price_url: abo.price_url,
            // Table de présentation dérivée par defineTarif (types de jour,
            // bandes horaires) : consommée par le renderer via tariffDisplay.
            display: abo.display
        }
    });
}

// Transforme les plages brutes des inputs time ([["22:00","23:59"], ...])
// en plages HC arrondies à l'heure, en écartant les plages vides.
// Exportée pour les tests unitaires.
export function buildHCRanges(hcRawRanges) {
    return hcRawRanges
        .map(([rawStart, rawEnd]) => formatHCRange(rawStart, rawEnd))
        .filter(range => range != null);
}

function formatHCRange(rawStart, rawEnd) {
    const startTime = rawStart.split(":");
    let startHours = parseInt(startTime[0]);
    let startMinutes = parseInt(startTime[1]);
    const endTime = rawEnd.split(":");
    let endHours = parseInt(endTime[0]);
    let endMinutes = parseInt(endTime[1]);

    if (startMinutes > 30) {
        startHours++;
        startMinutes = 0;
    }

    //Permet de gérer le 23:59
    if (endMinutes > 30) {
        endHours++;
        endMinutes = 0;
    }

    if (startHours >= endHours) {
        return null;
    } else {
        return {
            start: { hour: startHours, minute: startMinutes },
            end: { hour: endHours, minute: endMinutes }
        }
    }
}
