// Rendu commun aux fiches statiques et à la consultation des archives.
import { escapeHtml, formatDate, formatNumber } from '../utils/tarifFormat.js';
import { bandInfo, dayBadge } from './tariffDisplay.js';

export function joinFr(items) {
    return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`;
}

// "3, 6" -> "3 et 6 kVA" ; plage contiguë de la grille -> "9 à 36 kVA"
export function formatKvaGroup(kvas, allKvas) {
    if (kvas.length === 1) return `${kvas[0]} kVA`;
    const first = allKvas.indexOf(kvas[0]);
    const contiguous = kvas.every((k, i) => allKvas[first + i] === k);
    if (contiguous && kvas.length >= 3) return `${kvas[0]} à ${kvas.at(-1)} kVA`;
    if (kvas.length <= 3) return `${joinFr(kvas.map(String))} kVA`;
    return null; // liste longue non contiguë : libellé décidé par l'appelant
}

export function renderBadge(badge) {
    return `<span class="badge daytype-badge" style="background-color: ${badge.color}; color: ${badge.ink}">${escapeHtml(badge.label)}</span>`;
}

const percentFormat = new Intl.NumberFormat('fr-FR', { style: 'percent', signDisplay: 'always', minimumFractionDigits: 2, maximumFractionDigits: 2 });

function price(value, old, compare) {
    const amount = formatNumber(value);
    if (!compare) return amount;
    let change;
    if (old === undefined) change = 'Nouveau';
    else if (value === old) change = 'Inchangé';
    else if (old === 0) change = 'Écart non calculable';
    else change = percentFormat.format((value - old) / old);
    const trend = old === undefined || old === 0 || old === value ? '' : value > old ? ' tarif-rise' : ' tarif-fall';
    return `${amount}<small class="tarif-change${trend}">${change}</small>`;
}

function rowLabel(row) {
    const parts = [];
    if (row.badge) parts.push(renderBadge(row.badge));
    if (row.band) parts.push(`<span class="tarif-band">${escapeHtml(row.band)}</span>`);
    if (parts.length === 0) parts.push('Tous les jours');
    if (row.window) parts.push(`<span class="tarif-window">${escapeHtml(row.window)}</span>`);
    return parts.join(' ');
}

function renderPriceTable(hasHpHc, group, periods, compare, ind) {
    const cols = hasHpHc ? ['Heures pleines', 'Heures creuses'] : ['Prix du kWh'];
    const lines = [
        `${ind}<table class="table tarif-table">`,
        `${ind}    <caption class="visually-hidden">Prix du kWh TTC en centimes d’euro${group.kvaLabel ? ` (${escapeHtml(group.kvaLabel)})` : ''}</caption>`,
        `${ind}    <thead><tr><th scope="col">Période</th>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>`,
        `${ind}    <tbody>`,
    ];
    for (const [type, cellsNow] of Object.entries(group.rates)) {
        const period = periods?.[type];
        const band = bandInfo(type);
        const row = { badge: dayBadge(period?.day), window: period?.window, band: 'single' in cellsNow && band.id !== 'base' ? band.label : null };
        const cell = key => price(cellsNow[key], group.before?.[type]?.[key], compare);
        let cells;
        if ('single' in cellsNow) {
            cells = hasHpHc
                ? `<td colspan="2" class="tarif-single" data-label="Prix unique">${cell('single')}</td>`
                : `<td data-label="Prix du kWh">${cell('single')}</td>`;
        } else {
            cells = `<td data-label="Heures pleines">${cell('HP')}</td><td data-label="Heures creuses">${cell('HC')}</td>`;
        }
        lines.push(`${ind}        <tr><th scope="row">${rowLabel(row)}</th>${cells}</tr>`);
    }
    lines.push(`${ind}    </tbody>`, `${ind}</table>`);
    return lines;
}

function renderSpot(g, previous, ind) {
    const component = (key, season) => {
        const now = g.formula[key];
        const old = previous?.formula?.[key];
        return price(season ? now[season] : now, season ? old?.[season] : old, Boolean(previous));
    };
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
        row('TURPE (acheminement)', component('turpe', 'hiver'), component('turpe', 'ete')),
        row('Plafond (spot + TURPE + accise)', component('cap', 'hiver'), component('cap', 'ete')),
        row('Accise', component('accise')),
        row('Conformité (CEE, capacité)', component('conformite')),
        row('Marge du fournisseur', component('marge')),
        row('Prime de couverture', component('prime')),
        row('TVA', `× ${component('tva')}`),
        `${ind}    </tbody>`,
        `${ind}</table>`,
    ];
}

// Un même prix actuel peut avoir plusieurs prédécesseurs selon la puissance.
// On sépare les lignes seulement lorsque les prix à comparer diffèrent.
function groupsForComparison(grid, previous) {
    const groups = [];
    for (const group of grid.groups) {
        const byPrevious = new Map();
        for (const kva of group.kvas) {
            const before = previous?.groups?.find(g => g.kvas.includes(kva))?.rates;
            const key = JSON.stringify(before);
            if (!byPrevious.has(key)) byPrevious.set(key, { rates: group.rates, before, kvas: [] });
            byPrevious.get(key).kvas.push(kva);
        }
        groups.push(...byPrevious.values());
    }
    return groups;
}

export function renderPriceSections(grid, previous, ind = '') {
    const inner = ind + '    ';
    const compare = Boolean(previous);
    const lines = [
        `${ind}<section class="tarif-section">`,
        `${inner}<h2>Abonnement</h2>`,
    ];
    const reference = compare
        ? [`${inner}<p class="tarif-reference">Évolution depuis la grille du ${formatDate(previous.date)}.</p>`]
        : [];
    lines.push(...reference,
        `${inner}<table class="table tarif-table">`,
        `${inner}    <caption class="visually-hidden">Abonnement TTC par puissance souscrite</caption>`,
        `${inner}    <thead><tr><th scope="col">Puissance</th><th scope="col">€ TTC / mois</th><th scope="col">€ TTC / an</th></tr></thead>`,
        `${inner}    <tbody>`,
    );
    const annual = monthly => Math.round(monthly * 12 * 100) / 100;
    for (const [kva, monthly] of Object.entries(grid.subscriptions)) {
        const old = previous?.subscriptions[kva];
        lines.push(`${inner}        <tr><th scope="row">${escapeHtml(kva)} kVA</th>`
            + `<td data-label="€ TTC / mois">${price(monthly, old, compare)}</td>`
            + `<td data-label="€ TTC / an">${price(annual(monthly), old === undefined ? undefined : annual(old), compare)}</td></tr>`);
    }
    lines.push(`${inner}    </tbody>`, `${inner}</table>`, `${ind}</section>`, '',
        `${ind}<section class="tarif-section">`, `${inner}<h2>Prix du kWh</h2>`, ...reference);
    if (grid.formula) {
        lines.push(...renderSpot(grid, previous, inner));
    } else {
        if (grid.marketIndex) {
            lines.push(`${inner}<p>Chaque heure, le simulateur ajoute aux montants du tableau le prix EPEX France Day-Ahead de cette heure, TVA comprise. Un cours négatif réduit la facture.</p>`);
        }
        lines.push(`${inner}<p class="tarif-unit">${grid.marketIndex ? 'Part hors cours EPEX' : 'Prix TTC'} en centimes d’euro par kWh.</p>`);
        const groups = groupsForComparison(grid, previous);
        const kvas = Object.keys(grid.subscriptions).map(Number);
        for (const group of groups) {
            if (groups.length > 1) {
                group.kvaLabel = formatKvaGroup(group.kvas, kvas) ?? `${joinFr(group.kvas.map(String))} kVA`;
                lines.push(`${inner}<h3>${escapeHtml(group.kvaLabel)}</h3>`);
            }
            const hasHpHc = Object.values(group.rates).some(cells => 'HP' in cells);
            lines.push(...renderPriceTable(hasHpHc, group, grid.periods, compare, inner));
        }
    }
    lines.push(`${ind}</section>`, '');
    return lines;
}

// Les anciennes grilles ne présentent que les horaires documentés pour cette version.
export function renderHcSection(grid, ind, archived = false) {
    const hc = grid.hc;
    if (!hc) return [];
    const inner = ind + '    ';
    const lines = [`${ind}<section class="tarif-section">`, `${inner}<h2>Heures creuses</h2>`];
    if (hc.mode === 'custom') {
        const hint = archived ? '' : ' Renseignez-les dans le simulateur.';
        lines.push(`${inner}<p>Les heures creuses sont celles de votre compteur Linky, fixées par Enedis selon votre adresse (8 heures par jour).${hint}</p>`);
    } else if (hc.mode === 'fixed') {
        lines.push(`${inner}<p>Tous les jours&nbsp;: <strong>${escapeHtml(hc.text)}</strong>.</p>`);
    } else if (hc.mode === 'byDayType') {
        lines.push(`${inner}<ul class="tarif-list">`);
        for (const { day, text } of hc.byType) {
            lines.push(`${inner}    <li>${day ? renderBadge(dayBadge(day)) + ' ' : ''}${escapeHtml(text)}</li>`);
        }
        lines.push(`${inner}</ul>`);
    }
    lines.push(`${ind}</section>`, '');
    return lines;
}
