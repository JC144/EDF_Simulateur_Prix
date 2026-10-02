// Génère une page statique standardisée par tarif : tarifs/<slug>.html
// (date de la grille, liens vers l'offre et la grille officielle, abonnement
// par puissance, prix du kWh, heures creuses, règle des types de jour), et
// les entrées correspondantes du sitemap.xml.
//
// Usage :
//   node import/tools/gen-tarif-pages.mjs           # écrit les pages + sitemap
//   node import/tools/gen-tarif-pages.mjs --check   # exit 1 si quelque chose est à régénérer
// (dans les deux modes : exit 1 si un title dépasse 60 caractères ou une meta
// description 155)
// (ou, depuis import/ : npm run gen / npm run gen:check pour tout le site)
//
// Sources : définitions brutes (listTarifDefs : dayRule, hcRanges,
// priceOverrides, spotFormula…) + abonnements construits par la VRAIE
// librairie defineTarif (loadBuiltTarifs : table display, calendriers).
// Sortie déterministe : ne dépend que des données. L'avertissement « grille
// de plus de 6 mois » est calculé dans le navigateur (scripts/tarif-page.js).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { listTarifDefs, loadBuiltTarifs, REPO_ROOT } from '../lib/tarif-defs.mjs';
import {
    COMMUNITY_NOTE, JOURS, MOIS, escapeHtml, formatDate, formatHour, formatNumber, providerOf, offerLabel,
    replaceBetweenMarkers, reportChanges, syncFile, toMinutes,
} from '../lib/site-gen.mjs';
import { tarifSlug, STALE_MONTHS } from '../../scripts/utils/tarifMeta.js';
import { bandInfo, dayBadge } from '../../scripts/ui/tariffDisplay.js';

export const SITE_URL = 'https://comparateur-abonnements-electricite.fr';
const PAGES_DIR = 'tarifs';
// Présent dans chaque page générée : seules ces pages peuvent être supprimées
// comme orphelines (tarif retiré ou renommé).
export const GENERATED_MARK = 'Page générée par import/tools/gen-tarif-pages.mjs';
const SITEMAP_BEGIN = '<!-- TARIF-PAGES:BEGIN -->';
const SITEMAP_END = '<!-- TARIF-PAGES:END -->';

// Copie de la CSP de mentions-legales.html / index.html (site sans en-têtes
// HTTP personnalisables) : à garder synchronisée.
const CSP = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'none'";

// Les CTA mènent à l'accueil, dont app.js ouvre directement l'assistant
// d'import quand l'URL porte ce hash.
const SIMULATOR_HREF = '../#simulateur';
// Flèche (fa-arrow-right) en ligne : les pages de grille n'ont pas le sprite SVG de l'accueil.
const ARROW_ICON = '<svg class="icon icon-arrow-right ms-2" viewBox="0 0 448 512" aria-hidden="true" focusable="false">'
    + '<path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>';

// ------------------------------------------------------------------ //
//  Plages horaires                                                   //
// ------------------------------------------------------------------ //

// Intervalles en minutes [début, fin] -> fusionnés, triés, minuit recollé
// (22h-24h + 0h-6h = 22h-6h). Une fin > 1440 désigne le lendemain.
export function mergeIntervals(intervals) {
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const [from, to] of sorted) {
        const last = merged.at(-1);
        if (last && from <= last[1]) last[1] = Math.max(last[1], to);
        else merged.push([from, to]);
    }
    if (merged.length > 1 && merged[0][0] === 0 && merged.at(-1)[1] === 1440) {
        const first = merged.shift();
        merged.at(-1)[1] = 1440 + first[1];
    }
    return merged;
}

// -> "22h00 – 06h00, 13h00 – 16h00" | "toute la journée" | "aucune heure creuse"
export function formatIntervals(intervals, emptyLabel = 'aucune') {
    const merged = mergeIntervals(intervals);
    if (merged.length === 0) return emptyLabel;
    if (merged.length === 1 && merged[0][0] === 0 && merged[0][1] === 1440) return 'toute la journée';
    return merged
        .sort((a, b) => a[0] - b[0])
        .map(([from, to]) => `${formatHour(from)} – ${formatHour(to > 1440 ? to - 1440 : to)}`)
        .join(', ');
}

// Plages HC { from, to } -> intervalles. Une plage dont la fin précède le
// début (ex. « 22:00 → 00:00 », minuit doit s'écrire 24:00) n'est jamais
// atteinte par le calculateur : elle est ignorée ici aussi, pour afficher ce
// qui est réellement facturé.
function hcIntervals(ranges) {
    return ranges
        .map(r => [toMinutes(r.from), toMinutes(r.to)])
        .filter(([from, to]) => to > from);
}

// ------------------------------------------------------------------ //
//  Textes                                                            //
// ------------------------------------------------------------------ //

// ["a", "b", "c"] -> "a, b et c"
function joinFr(items) {
    return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`;
}

// [11, 12, 1, 2, 3] -> "de novembre à mars" (séquence cyclique unique), sinon liste.
export function formatMonths(months) {
    const set = new Set(months);
    if (set.size === 12) return 'toute l’année';
    const start = [...set].find(m => !set.has(m === 1 ? 12 : m - 1));
    const run = [];
    for (let m = start; set.has(m) && run.length < 12; m = m === 12 ? 1 : m + 1) run.push(m);
    if (run.length === set.size) {
        if (run.length === 1) return `en ${MOIS[start - 1]}`;
        const from = MOIS[run[0] - 1];
        return `${/^[aeiouéâ]/.test(from) ? 'd’' : 'de '}${from} à ${MOIS[run.at(-1) - 1]}`;
    }
    return `en ${joinFr([...set].sort((a, b) => a - b).map(m => MOIS[m - 1]))}`;
}

// [0, 6] -> "samedi et dimanche" (semaine ordonnée du lundi au dimanche) ;
// article = "le" -> "le samedi et le dimanche".
function formatWeekDays(days, article = '') {
    const order = d => (d + 6) % 7;
    return joinFr([...days].sort((a, b) => order(a) - order(b)).map(d => article + JOURS[d]));
}

// "3, 6" -> "3 et 6 kVA" ; plage contiguë de la grille -> "9 à 36 kVA"
function formatKvaGroup(kvas, allKvas) {
    if (kvas.length === 1) return `${kvas[0]} kVA`;
    const first = allKvas.indexOf(kvas[0]);
    const contiguous = kvas.every((k, i) => allKvas[first + i] === k);
    if (contiguous && kvas.length >= 3) return `${kvas[0]} à ${kvas.at(-1)} kVA`;
    if (kvas.length <= 3) return `${joinFr(kvas.map(String))} kVA`;
    return null; // liste longue non contiguë : libellé décidé par l'appelant
}

// ------------------------------------------------------------------ //
//  Modèle de grille                                                  //
// ------------------------------------------------------------------ //

function badgeOf(dayKey, warnings, name) {
    if (dayKey === null || dayKey === undefined) return null;
    const badge = dayBadge(dayKey);
    if (badge.label === dayKey) {
        warnings.push(`${name} : type de jour « ${dayKey} » sans libellé dans scripts/ui/tariffDisplay.js (DAY_REGISTRY)`);
    }
    return badge;
}

// Sous-types horaires : type -> intervalles, et types « porteurs » (le type du
// jour hors des fenêtres).
function hourSubTypesOf(rule) {
    const windows = new Map();
    const carriers = new Set();
    const add = (carrier, subs) => {
        if (!subs || subs.length === 0) return;
        carriers.add(carrier);
        for (const sub of subs) {
            if (!windows.has(sub.dayType)) windows.set(sub.dayType, []);
            windows.get(sub.dayType).push([sub.fromHour * 60, sub.toHour * 60]);
        }
    };
    if (rule.type === 'constant') add(rule.dayType, rule.hourSubTypes);
    if (rule.type === 'season') {
        for (const [season, subs] of Object.entries(rule.hourSubTypes || {})) add(season, subs);
    }
    return { windows, carriers };
}

function buildPriceGroups(def, display, kvas, warnings) {
    const types = Object.keys(def.dayTypes);
    const { windows, carriers } = hourSubTypesOf(def.dayRule);
    const hasHpHc = types.some(t => 'HP' in def.dayTypes[t]);

    // Prix effectifs par puissance, regroupés quand ils sont identiques.
    const groups = [];
    for (const kva of kvas) {
        const effective = types.map(t => def.priceOverrides?.[kva]?.[t] ?? def.dayTypes[t]);
        const key = JSON.stringify(effective);
        const group = groups.find(g => g.key === key);
        if (group) group.kvas.push(kva);
        else groups.push({ key, kvas: [kva], effective });
    }

    const overridden = new Set(Object.keys(def.priceOverrides || {}).map(Number));
    return {
        hasHpHc,
        groups: groups.map(group => {
            let kvaLabel = null;
            if (groups.length > 1) {
                kvaLabel = formatKvaGroup(group.kvas, kvas)
                    ?? (group.kvas.some(k => overridden.has(k)) ? `${joinFr(group.kvas.map(String))} kVA` : 'Autres puissances');
            }
            const rows = types.map((type, i) => {
                const info = display.types[type];
                if (!info) throw new Error(`${def.name} : type « ${type} » absent de display`);
                const spec = group.effective[i];
                const band = bandInfo(type);
                return {
                    type,
                    badge: badgeOf(info.day, warnings, def.name),
                    // Fenêtre horaire nommée (super creuses, heures pleines d'une
                    // saison…) : seulement pour un prix unique, une bande HP/HC
                    // étant déjà portée par les colonnes.
                    band: ('price' in spec && band.id !== 'base') ? band.label : null,
                    window: windows.has(type) ? formatIntervals(windows.get(type))
                        : carriers.has(type) ? 'autres heures' : null,
                    cells: 'price' in spec ? { single: spec.price } : { HP: spec.HP, HC: spec.HC },
                };
            });
            return { kvaLabel, kvas: group.kvas, rows };
        }),
    };
}

function buildHc(def, display, warnings) {
    const ranges = def.hcRanges;
    if (ranges === undefined) return { mode: 'none' };
    if (ranges === 'custom') return { mode: 'custom' };
    if (Array.isArray(ranges)) return { mode: 'fixed', text: formatIntervals(hcIntervals(ranges)) };
    // Plages par type, dans l'ordre du tableau des prix : seuls les types
    // { HP, HC } sont concernés (un prix unique ne dépend pas de l'heure).
    const byType = Object.keys(def.dayTypes)
        .filter(type => 'HP' in def.dayTypes[type] && type in ranges.byDayType)
        .map(type => ({
            type,
            badge: badgeOf(display.types[type].day, warnings, def.name),
            text: formatIntervals(hcIntervals(ranges.byDayType[type]), 'aucune heure creuse'),
        }));
    return { mode: 'byDayType', byType };
}

// Lignes explicatives de la règle des types de jour (HTML : badges inclus).
function buildRuleLines(def, calendars) {
    const rule = def.dayRule;
    const chip = key => renderBadge(dayBadge(key));
    const lines = [];
    const veille = h => `Avant ${h}&nbsp;h du matin, c’est le type de jour de la veille qui s’applique.`;

    switch (rule.type) {
        case 'constant':
            lines.push('Mêmes prix tous les jours de l’année.');
            break;
        case 'weekly': {
            const [special, days] = Object.entries(rule.days)[0];
            lines.push(`${chip(special)} chaque ${formatWeekDays(days)}.`);
            lines.push(`${chip(rule.default)} tous les autres jours.`);
            if (rule.userDaySetting === 'jourZenPlus') {
                lines.push(`Un jour de semaine supplémentaire, choisi par le client, est facturé au prix ${chip(special)} (réglage « jour Zen+ » du simulateur).`);
            }
            break;
        }
        case 'calendar': {
            const calendar = calendars[rule.calendar];
            for (const [type, entry] of Object.entries(calendar)) {
                const period = entry.monthBegin && entry.monthEnd
                    ? `, placés par le fournisseur entre ${MOIS[entry.monthBegin - 1]} et ${MOIS[entry.monthEnd - 1]}`
                    : ', placés par le fournisseur';
                const count = entry.numberOfDays ? `${entry.numberOfDays} jours par an` : 'Jours';
                lines.push(`${chip(type)} ${count}${period}.`);
            }
            lines.push(`${chip(rule.default)} tous les autres jours.`);
            if (rule.previousDayBefore !== undefined) lines.push(veille(rule.previousDayBefore));
            break;
        }
        case 'season': {
            const weekend = rule.weekendDays ? formatWeekDays(rule.weekendDays, 'le ') : null;
            for (const [season, spec] of Object.entries(rule.seasons)) {
                const months = formatMonths(spec.months);
                if (spec.weekendType) {
                    lines.push(`${chip(season)} ${months}, en semaine.`);
                    lines.push(`${chip(spec.weekendType)} ${months}, ${weekend}.`);
                } else {
                    lines.push(`${chip(season)} ${months}.`);
                }
            }
            if (rule.calendarOverride) {
                for (const type of rule.calendarOverride.types) {
                    lines.push(`${chip(type)} jours fixés par le fournisseur, prioritaires sur la saison.`);
                }
            }
            if (rule.previousDayBefore !== undefined) lines.push(veille(rule.previousDayBefore));
            break;
        }
        case 'spot':
            lines.push('Pas de type de jour : le prix suit le marché de gros, créneau par créneau.');
            break;
    }
    return lines;
}

// Modèle complet d'une page, indépendant du HTML.
export function buildGrille(def, display, calendars, warnings = []) {
    const provider = providerOf(def);
    const kvas = Object.keys(def.subscriptions).map(Number).sort((a, b) => a - b);
    const grille = {
        slug: tarifSlug(def.name),
        file: def.file,
        name: def.name,
        provider,
        offer: offerLabel(def, provider),
        offerType: def.offer_type,
        isCommunity: def.isCommunity === true,
        lastUpdate: def.lastUpdate,
        subscriptionUrl: def.subscription_url || null,
        priceUrl: def.price_url,
        priceIsPdf: /\.pdf(\?|#|$)/i.test(def.price_url),
        subscriptions: kvas.map(kva => {
            const monthly = def.subscriptions[kva];
            return { kva, monthly, yearly: Math.round(monthly * 12 * 100) / 100 };
        }),
        ruleLines: buildRuleLines(def, calendars),
    };
    if (def.dayRule.type === 'spot') {
        return { ...grille, kind: 'spot', formula: def.spotFormula, source: def.dayRule.source };
    }
    return {
        ...grille,
        kind: 'grid',
        prices: buildPriceGroups(def, display, kvas, warnings),
        hc: buildHc(def, display, warnings),
    };
}

// ------------------------------------------------------------------ //
//  Rendu HTML                                                        //
// ------------------------------------------------------------------ //

function renderBadge(badge) {
    return `<span class="badge daytype-badge" style="background-color: ${badge.color}; color: ${badge.ink}">${escapeHtml(badge.label)}</span>`;
}

const price = n => formatNumber(n);

function rowLabel(row) {
    const parts = [];
    if (row.badge) parts.push(renderBadge(row.badge));
    if (row.band) parts.push(`<span class="tarif-band">${escapeHtml(row.band)}</span>`);
    if (parts.length === 0) parts.push('Tous les jours');
    if (row.window) parts.push(`<span class="tarif-window">${escapeHtml(row.window)}</span>`);
    return parts.join(' ');
}

function renderPriceTable(prices, group, ind) {
    const cols = prices.hasHpHc ? ['Heures pleines', 'Heures creuses'] : ['Prix du kWh'];
    const lines = [
        `${ind}<table class="table tarif-table">`,
        `${ind}    <caption class="visually-hidden">Prix du kWh TTC en centimes d’euro${group.kvaLabel ? ` (${escapeHtml(group.kvaLabel)})` : ''}</caption>`,
        `${ind}    <thead><tr><th scope="col">Période</th>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>`,
        `${ind}    <tbody>`,
    ];
    for (const row of group.rows) {
        let cells;
        if ('single' in row.cells) {
            cells = prices.hasHpHc
                ? `<td colspan="2" class="tarif-single" data-label="Prix unique">${price(row.cells.single)}</td>`
                : `<td data-label="Prix du kWh">${price(row.cells.single)}</td>`;
        } else {
            cells = `<td data-label="Heures pleines">${price(row.cells.HP)}</td><td data-label="Heures creuses">${price(row.cells.HC)}</td>`;
        }
        lines.push(`${ind}        <tr><th scope="row">${rowLabel(row)}</th>${cells}</tr>`);
    }
    lines.push(`${ind}    </tbody>`, `${ind}</table>`);
    return lines;
}

function renderSpot(g, ind) {
    const f = g.formula;
    const source = g.source === 'epex-fr' ? 'prix spot EPEX FR day-ahead' : `prix spot « ${escapeHtml(g.source)} »`;
    const row = (label, hiver, ete) => ete === undefined
        ? `${ind}        <tr><th scope="row">${label}</th><td colspan="2" class="tarif-single" data-label="Toute l’année">${hiver}</td></tr>`
        : `${ind}        <tr><th scope="row">${label}</th><td data-label="Hiver">${hiver}</td><td data-label="Été">${ete}</td></tr>`;
    return [
        `${ind}<p>Le prix du kWh suit le prix de gros de l’électricité (${source}), créneau par créneau&nbsp;:</p>`,
        `${ind}<p class="tarif-formula">(min(spot + TURPE + accise&nbsp;; plafond) + conformité + marge + prime) × TVA</p>`,
        `${ind}<p class="tarif-unit">Composantes en centimes d’euro HT par kWh. Saisons TURPE&nbsp;: hiver de novembre à mars, été d’avril à octobre.</p>`,
        `${ind}<table class="table tarif-table">`,
        `${ind}    <caption class="visually-hidden">Composantes de la formule du prix du kWh</caption>`,
        `${ind}    <thead><tr><th scope="col">Composante</th><th scope="col">Hiver</th><th scope="col">Été</th></tr></thead>`,
        `${ind}    <tbody>`,
        row('TURPE (acheminement)', price(f.turpe.hiver), price(f.turpe.ete)),
        row('Plafond (spot + TURPE + accise)', price(f.cap.hiver), price(f.cap.ete)),
        row('Accise', price(f.accise)),
        row('Conformité (CEE, capacité)', price(f.conformite)),
        row('Marge du fournisseur', price(f.marge)),
        row('Prime de couverture', price(f.prime)),
        row('TVA', `× ${price(f.tva)}`),
        `${ind}    </tbody>`,
        `${ind}</table>`,
    ];
}

function renderHc(hc, ind) {
    switch (hc.mode) {
        case 'custom':
            return [`${ind}<p>Les heures creuses sont celles de votre compteur Linky, fixées par Enedis selon votre adresse (8 heures par jour). Renseignez-les dans le simulateur.</p>`];
        case 'fixed':
            return [`${ind}<p>Tous les jours&nbsp;: <strong>${escapeHtml(hc.text)}</strong>.</p>`];
        case 'byDayType':
            return [
                `${ind}<ul class="tarif-list">`,
                ...hc.byType.map(t => `${ind}    <li>${t.badge ? renderBadge(t.badge) + ' ' : ''}${escapeHtml(t.text)}</li>`),
                `${ind}</ul>`,
            ];
        default:
            return [];
    }
}

// Longueurs au-delà desquelles Google tronque ou réécrit (contrôlées par run).
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

// "Enercoop - Flexibilité - nuit & week-end" -> "Flexibilité nuit & week-end" :
// le premier segment est la marque, remplacée par le nom canonique du fournisseur.
function offerName(g) {
    const parts = g.name.split(' - ');
    return (parts.length > 1 ? parts.slice(1) : parts).join(' ');
}

// « l’offre Tempo d’EDF », « l’offre Constance de La Belle Énergie ».
function offerOfProvider(g) {
    return `l’offre ${offerName(g)} ${/^[aeiouéâ]/i.test(g.provider) ? 'd’' : 'de '}${g.provider}`;
}

// Premier candidat qui tient dans max, sinon le dernier (le plus court),
// signalé par run.
function fitting(candidates, max) {
    return candidates.find(c => c.length <= max) ?? candidates.at(-1);
}

// "<Offre> <Fournisseur> : prix du kWh <année> TTC", année de la grille ;
// « Heures Creuses » abrégé en « HC » si le titre dépasse TITLE_MAX.
export function pageTitle(g) {
    const year = g.lastUpdate.slice(0, 4);
    const kwh = g.kind === 'spot' ? `prix du kWh spot ${year}` : `prix du kWh ${year} TTC`;
    const offer = offerName(g);
    return fitting([offer, offer.replace(/heures creuses/i, 'HC')].map(o => `${o} ${g.provider} : ${kwh}`), TITLE_MAX);
}

export function pageDescription(g) {
    const kvas = g.subscriptions.map(s => s.kva);
    const range = kvas.length === 1 ? `${kvas[0]} kVA` : `de ${kvas[0]} à ${kvas.at(-1)} kVA`;
    const kwh = g.kind === 'spot' ? 'formule du prix du kWh indexé sur le prix spot' : 'prix du kWh TTC';
    const body = `Grille tarifaire ${g.provider} ${offerName(g)} du ${formatDate(g.lastUpdate)} : abonnement ${range}, ${kwh}`
        + `${g.kind === 'grid' && g.hc.mode !== 'none' ? ', heures creuses' : ''}.`;
    return fitting([
        `${body} Lien vers la grille officielle du fournisseur.`,
        `${body} Lien vers la grille officielle.`,
        body,
    ], DESCRIPTION_MAX);
}

// Nom affiché de l'offre (h1 et dernier niveau du fil d'Ariane).
function displayName(g) {
    return g.name.replaceAll(' - ', ' – ');
}

// JSON-LD WebPage + BreadcrumbList (audit SEO, findings/schema.md §4). Fil à
// 2 niveaux, Accueil > offre : il n'existe pas de page /tarifs/. Les @id
// #website et #auteur sont déclarés dans le JSON-LD de index.html. Aucun prix
// (Product/Offer trompeurs pour un site non marchand) : ils restent dans les
// tableaux.
export function pageJsonLd(g) {
    const url = `${SITE_URL}/${PAGES_DIR}/${g.slug}.html`;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${url}#webpage`,
                url,
                name: pageTitle(g),
                description: pageDescription(g),
                inLanguage: 'fr-FR',
                dateModified: g.lastUpdate,
                isPartOf: { '@id': `${SITE_URL}/#website` },
                breadcrumb: { '@id': `${url}#breadcrumb` },
                about: {
                    '@type': 'Thing',
                    name: `Grille tarifaire ${displayName(g)}`,
                    description: `Abonnement et prix du kWh de ${offerOfProvider(g)}`,
                },
                isBasedOn: g.priceUrl,
                publisher: { '@id': `${SITE_URL}/#auteur` },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
                    { '@type': 'ListItem', position: 2, name: displayName(g) },
                ],
            },
        ],
    };
}

// JSON indenté sous ind ; « < » échappé pour ne jamais fermer le <script>.
function renderJsonLd(data, ind) {
    const json = JSON.stringify(data, null, 4).replaceAll('<', '\\u003c');
    return [
        `${ind}<script type="application/ld+json">`,
        ...json.split('\n').map(l => `${ind}${l}`),
        `${ind}</script>`,
    ];
}

// Carte d'appel au simulateur, sous l'en-tête. Les tarifs communautaires ne
// sont simulés que si l'utilisateur les inclut (dernière étape de l'assistant).
function renderCta(g, ind) {
    const S = ind + '    ';
    return [
        `${ind}<section class="tarif-cta" aria-labelledby="tarif-cta-title">`,
        `${S}<h2 id="tarif-cta-title">Combien vous coûterait ${escapeHtml(offerOfProvider(g))}&nbsp;?</h2>`,
        `${S}<p>Importez votre historique de consommation Linky&nbsp;: le simulateur calcule, demi-heure par demi-heure,`
            + ' ce que vous auriez payé avec cette offre et la compare aux autres offres d’électricité suivies.</p>',
        ...(g.isCommunity
            ? [`${S}<p>Tarif communautaire&nbsp;: à la dernière étape, choisissez d’inclure les tarifs communautaires pour voir cette offre dans les résultats.</p>`]
            : []),
        `${S}<a class="btn btn-success btn-lg tarif-cta-btn" href="${SIMULATOR_HREF}">Comparer avec ma consommation réelle${ARROW_ICON}</a>`,
        `${S}<p class="tarif-cta-privacy">Gratuit, sans inscription&nbsp;: vos données Linky ne quittent jamais votre navigateur.</p>`,
        `${ind}</section>`,
        '',
    ];
}

export function renderPage(g) {
    const I = '    ';
    const M = I + I; // enfants de <main>
    const S = M + I; // enfants de <section>
    const url = `${SITE_URL}/${PAGES_DIR}/${g.slug}.html`;
    const lines = [
        '<!DOCTYPE html>',
        '<html lang="fr">',
        '',
        '<head>',
        `${I}<!-- ${GENERATED_MARK} à partir de ${g.file} : ne pas éditer à la main (cd import && npm run gen). -->`,
        `${I}<meta charset="utf-8">`,
        `${I}<meta name="viewport" content="width=device-width, initial-scale=1">`,
        `${I}<meta http-equiv="Content-Security-Policy"`,
        `${I}    content="${CSP}">`,
        `${I}<meta name="referrer" content="strict-origin-when-cross-origin">`,
        `${I}<meta name="description" content="${escapeHtml(pageDescription(g))}">`,
        `${I}<meta name="author" content="jcvasselon">`,
        `${I}<title>${escapeHtml(pageTitle(g))}</title>`,
        `${I}<link rel="canonical" href="${url}">`,
        '',
        `${I}<link rel="preconnect" href="https://cdn.jsdelivr.net">`,
        `${I}<link rel="preconnect" href="https://fonts.googleapis.com">`,
        `${I}<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
        `${I}<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet"`,
        `${I}    integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">`,
        `${I}<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap" rel="stylesheet">`,
        `${I}<link rel="stylesheet" href="../style.css" />`,
        `${I}<link rel="icon" type="image/x-icon" href="/img/favicon.ico">`,
        '',
        ...renderJsonLd(pageJsonLd(g), I),
        '</head>',
        '',
        '<body>',
        `${I}<nav class="site-nav">`,
        `${I}    <div class="shell site-nav-inner">`,
        `${I}        <a href="../" class="site-nav-brand">`,
        `${I}            <picture>`,
        `${I}                <source srcset="../img/logo.webp" type="image/webp">`,
        `${I}                <img src="../img/logo.png" width="32" height="32" alt="logo">`,
        `${I}            </picture>`,
        `${I}            <span>Comparateur d'abonnements d'électricité</span>`,
        `${I}        </a>`,
        `${I}    </div>`,
        `${I}</nav>`,
        '',
        `${I}<main class="shell legal-shell tarif-page" data-last-update="${g.lastUpdate}">`,
        // Fil d'Ariane visible : doit correspondre au BreadcrumbList du JSON-LD.
        `${M}<nav aria-label="Fil d’Ariane" class="breadcrumb-nav">`,
        `${M}    <ol>`,
        `${M}        <li><a href="../">Accueil</a></li>`,
        `${M}        <li aria-current="page">${escapeHtml(displayName(g))}</li>`,
        `${M}    </ol>`,
        `${M}</nav>`,
        `${M}<header class="tarif-header">`,
        `${M}    <div class="kicker">${escapeHtml(g.provider)}</div>`,
        `${M}    <h1>${escapeHtml(displayName(g))}</h1>`,
        `${M}    <p class="tarif-badges"><span class="tarif-badge">${g.offerType === 'TRV' ? 'Tarif réglementé' : 'Offre de marché'}</span>`
            + `${g.isCommunity ? ' <span class="tarif-badge tarif-badge-community">Tarif communautaire</span>' : ''}</p>`,
    ];
    if (g.isCommunity) lines.push(`${M}    <p class="tarifs-note">${COMMUNITY_NOTE}</p>`);
    lines.push(`${M}</header>`, '', ...renderCta(g, M));

    // Source de la grille : date, avertissement d'ancienneté, liens.
    lines.push(
        `${M}<section class="tarif-meta" aria-label="Source de la grille">`,
        `${S}<p class="tarif-date">Grille tarifaire du <time datetime="${g.lastUpdate}">${formatDate(g.lastUpdate)}</time></p>`,
        `${S}<div class="alert alert-warning tarif-stale" role="alert" hidden>Cette grille a plus de ${STALE_MONTHS} mois&nbsp;:`
            + ' les prix ont probablement évolué depuis. Vérifiez-les sur le site du fournisseur avant toute décision.</div>',
        `${S}<noscript><p class="tarif-stale-hint">Si cette grille a plus de ${STALE_MONTHS} mois, les prix ont probablement évolué&nbsp;:`
            + ' vérifiez-les sur le site du fournisseur.</p></noscript>',
        `${S}<ul class="tarif-links">`,
    );
    if (g.subscriptionUrl) {
        lines.push(`${S}    <li><a href="${escapeHtml(g.subscriptionUrl)}" target="_blank" rel="noopener">Page de l’offre sur le site du fournisseur</a></li>`);
    }
    lines.push(
        `${S}    <li><a href="${escapeHtml(g.priceUrl)}" target="_blank" rel="noopener">Grille tarifaire officielle${g.priceIsPdf ? ' (PDF)' : ''}</a></li>`,
        `${S}</ul>`,
        `${M}</section>`,
        '',
    );

    // Abonnement
    lines.push(
        `${M}<section class="tarif-section">`,
        `${S}<h2>Abonnement</h2>`,
        `${S}<table class="table tarif-table">`,
        `${S}    <caption class="visually-hidden">Abonnement TTC par puissance souscrite</caption>`,
        `${S}    <thead><tr><th scope="col">Puissance</th><th scope="col">€ TTC / mois</th><th scope="col">€ TTC / an</th></tr></thead>`,
        `${S}    <tbody>`,
        ...g.subscriptions.map(s => `${S}        <tr><th scope="row">${s.kva} kVA</th>`
            + `<td data-label="€ TTC / mois">${formatNumber(s.monthly)}</td><td data-label="€ TTC / an">${formatNumber(s.yearly)}</td></tr>`),
        `${S}    </tbody>`,
        `${S}</table>`,
        `${M}</section>`,
        '',
    );

    // Prix du kWh
    lines.push(`${M}<section class="tarif-section">`, `${S}<h2>Prix du kWh</h2>`);
    if (g.kind === 'spot') {
        lines.push(...renderSpot(g, S));
    } else {
        lines.push(`${S}<p class="tarif-unit">Prix TTC en centimes d’euro par kWh.</p>`);
        for (const group of g.prices.groups) {
            if (group.kvaLabel) lines.push(`${S}<h3>${escapeHtml(group.kvaLabel)}</h3>`);
            lines.push(...renderPriceTable(g.prices, group, S));
        }
    }
    lines.push(`${M}</section>`, '');

    if (g.kind === 'grid' && g.hc.mode !== 'none') {
        lines.push(`${M}<section class="tarif-section">`, `${S}<h2>Heures creuses</h2>`, ...renderHc(g.hc, S), `${M}</section>`, '');
    }

    lines.push(
        `${M}<section class="tarif-section">`,
        `${S}<h2>Types de jour</h2>`,
        `${S}<ul class="tarif-list">`,
        ...g.ruleLines.map(l => `${S}    <li>${l}</li>`),
        `${S}</ul>`,
        `${M}</section>`,
        `${M}<p class="tarif-footer-cta"><a class="btn btn-success tarif-cta-btn" href="${SIMULATOR_HREF}">`
            + `Simuler cette offre avec ma consommation Linky${ARROW_ICON}</a></p>`,
        `${I}</main>`,
        '',
        `${I}<footer class="band-dark tarif-footer">`,
        `${I}    <div class="shell">`,
        `${I}        <div class="about-links-row">`,
        `${I}            <div>`,
        `${I}                <a href="../mentions-legales.html">Mentions légales &amp; confidentialité</a> ·`,
        `${I}                <a href="https://github.com/JC144/EDF_Simulateur_Prix/issues" rel="noopener">Contact (issues GitHub)</a> ·`,
        `${I}                <a href="https://github.com/JC144/EDF_Simulateur_Prix" rel="noopener">Code source sur GitHub</a>`,
        `${I}            </div>`,
        `${I}            <p>Prix issus des documents publics du fournisseur&nbsp;: seuls les prix publiés par celui-ci font foi.</p>`,
        `${I}        </div>`,
        `${I}    </div>`,
        `${I}</footer>`,
        `${I}<script type="module" src="../scripts/tarif-page.js"></script>`,
        '</body>',
        '',
        '</html>',
        '',
    );
    return lines.join('\n');
}

function renderSitemapEntries(grilles) {
    const entries = [...grilles]
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .map(g => [
            '  <url>',
            `    <loc>${SITE_URL}/${PAGES_DIR}/${g.slug}.html</loc>`,
            `    <lastmod>${g.lastUpdate}</lastmod>`,
            '  </url>',
        ].join('\n'));
    return `\n${entries.join('\n')}\n  `;
}

// ------------------------------------------------------------------ //
//  Orchestration                                                     //
// ------------------------------------------------------------------ //

// -> { changes: [{ path, status }], warnings: [string] }
export function run({ check = false } = {}) {
    const defs = listTarifDefs();
    const { abonnements, calendars } = loadBuiltTarifs();
    const built = new Map(abonnements.map(a => [a.name, a]));
    const warnings = [];

    const grilles = defs.map(def => {
        const abo = built.get(def.name);
        if (!abo) throw new Error(`${def.name} (${def.file}) n'est pas chargé par l'application : déclarer le script dans scripts/tarifs-manifest.js avant de générer sa page.`);
        return buildGrille(def, abo.display, calendars, warnings);
    });
    const bySlug = new Map();
    for (const g of grilles) {
        if (bySlug.has(g.slug)) throw new Error(`Slug « ${g.slug} » partagé par « ${bySlug.get(g.slug).name} » et « ${g.name} » : renommer l'un des tarifs.`);
        bySlug.set(g.slug, g);
    }

    // Longueurs title / meta description : bloquant, y compris sans --check.
    const errors = [];
    for (const g of grilles) {
        const title = pageTitle(g);
        const description = pageDescription(g);
        if (title.length > TITLE_MAX) errors.push(`${g.name} : title de ${title.length} caractères (max ${TITLE_MAX}) « ${title} »`);
        if (description.length > DESCRIPTION_MAX) errors.push(`${g.name} : meta description de ${description.length} caractères (max ${DESCRIPTION_MAX}) « ${description} »`);
    }

    const changes = [];
    const dir = path.join(REPO_ROOT, PAGES_DIR);
    for (const g of grilles) {
        changes.push(syncFile(path.join(dir, `${g.slug}.html`), renderPage(g), { check }));
    }

    // Pages orphelines (tarif retiré ou renommé) : seulement les pages générées.
    if (fs.existsSync(dir)) {
        for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort()) {
            if (bySlug.has(file.slice(0, -'.html'.length))) continue;
            const abs = path.join(dir, file);
            if (!fs.readFileSync(abs, 'utf8').includes(GENERATED_MARK)) continue;
            if (!check) fs.rmSync(abs);
            changes.push({ path: `${PAGES_DIR}/${file}`, status: check ? 'orphan' : 'removed' });
        }
    }

    const sitemapPath = path.join(REPO_ROOT, 'sitemap.xml');
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const nextSitemap = replaceBetweenMarkers(sitemap, SITEMAP_BEGIN, SITEMAP_END, renderSitemapEntries(grilles), 'sitemap.xml');
    changes.push(syncFile(sitemapPath, nextSitemap, { check }));

    return { changes, warnings, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const check = process.argv.includes('--check');
    const { changes, warnings, errors } = run({ check });
    for (const w of new Set(warnings)) console.warn(`Attention : ${w}`);
    for (const e of errors) console.error(`Erreur : ${e}`);
    process.exitCode = reportChanges(changes, { check, what: 'Pages de grille tarifaire (tarifs/*.html, sitemap.xml)' }) || (errors.length ? 1 : 0);
}
