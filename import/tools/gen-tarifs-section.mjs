// Génère la section statique « Tarifs actuellement suivis » d'index.html à
// partir des métadonnées defineTarif (name, offer_type, lastUpdate,
// isCommunity). Aucun prix calculé : uniquement des métadonnées, la sortie
// est donc stable tant que les tarifs ne changent pas. Chaque offre renvoie
// vers sa page de grille tarifaire (générée par gen-tarif-pages.mjs).
//
// Usage :
//   node import/tools/gen-tarifs-section.mjs           # réécrit index.html
//   node import/tools/gen-tarifs-section.mjs --check   # exit 1 si différent
// (ou, depuis import/ : npm run gen / npm run gen:check pour tout le site)
//
// La section est réécrite strictement entre les marqueurs
// <!-- TARIFS-LIST:BEGIN --> et <!-- TARIFS-LIST:END -->.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { listTarifDefs, REPO_ROOT } from '../lib/tarif-defs.mjs';
import {
    escapeHtml, formatDate, providerOf, offerLabel, replaceBetweenMarkers, syncFile, reportChanges, COMMUNITY_NOTE,
} from '../lib/site-gen.mjs';
import { tarifPagePath } from '../../scripts/utils/tarifMeta.js';

const BEGIN = '<!-- TARIFS-LIST:BEGIN -->';
const END = '<!-- TARIFS-LIST:END -->';
const INDENT = '                    '; // profondeur des enfants de <section> > .shell
const GROUP = INDENT + '        '; // <div class="tarifs-group"> (sous .tarifs-groups)
const GROUP_BODY = GROUP + '    '; // h3, note, .tarifs-grid
const OFFER = GROUP_BODY + '    '; // <div class="tarifs-offer">

// Carte d'offre : nom en gras, type + date de grille en méta grise, lien
// (interne) vers la page de grille à droite.
function renderOffer(def, provider) {
    const label = escapeHtml(offerLabel(def, provider));
    const type = def.offer_type === 'TRV' ? 'Tarif réglementé' : 'Offre de marché';
    const grille = `grille du ${formatDate(def.lastUpdate)}`;
    return [
        `${OFFER}<div class="tarifs-offer">`,
        `${OFFER}    <span class="tarifs-offer-name"><strong>${label}</strong>`,
        `${OFFER}        <span class="tarifs-offer-meta">${type} — ${grille}</span></span>`,
        `${OFFER}    <a href="${escapeHtml(tarifPagePath(def.name))}">détails de l’offre</a>`,
        `${OFFER}</div>`,
    ];
}

// Groupe (un fournisseur officiel ou le bloc communautaire) : h3 sous le h2 de
// la section, encart d'avertissement optionnel, puis grille de cartes.
function renderGroup(title, defs, provider, note) {
    const lines = [
        `${GROUP}<div class="tarifs-group">`,
        `${GROUP_BODY}<h3>${escapeHtml(title)}</h3>`,
    ];
    if (note) lines.push(`${GROUP_BODY}<p class="tarifs-note">${note}</p>`);
    lines.push(`${GROUP_BODY}<div class="tarifs-grid">`);
    for (const def of [...defs].sort((a, b) => a.name.localeCompare(b.name, 'fr'))) {
        lines.push(...renderOffer(def, provider));
    }
    lines.push(`${GROUP_BODY}</div>`);
    lines.push(`${GROUP}</div>`);
    return lines;
}

function generate(defs) {
    const official = defs.filter(d => d.isCommunity !== true);
    const community = defs.filter(d => d.isCommunity === true);

    const byProvider = new Map();
    for (const def of official) {
        const provider = providerOf(def);
        if (!byProvider.has(provider)) byProvider.set(provider, []);
        byProvider.get(provider).push(def);
    }

    const providers = [...byProvider.keys()].sort((a, b) => a.localeCompare(b, 'fr'));
    const nbProviders = new Set(defs.map(providerOf)).size;
    const lastUpdate = defs.map(d => d.lastUpdate).sort().at(-1);

    const lines = [];
    lines.push(`${INDENT}<p class="tarifs-intro"><strong>${defs.length} offres de ${nbProviders} fournisseurs</strong>`
        + ` sont actuellement suivies. Les grilles tarifaires sont actualisées au fil de l’eau à partir`
        + ` des documents officiels des fournisseurs (dernière mise à jour d’une grille : ${formatDate(lastUpdate)}).</p>`);
    // Détail replié derrière un collapse Bootstrap (bouton et chevron stylés par
    // .tarifs-toggle dans style.css) ; le bundle Bootstrap est déjà chargé.
    lines.push(`${INDENT}<button class="tarifs-toggle collapsed" type="button" data-bs-toggle="collapse"`);
    lines.push(`${INDENT}    data-bs-target="#tarifsDetail" aria-expanded="false" aria-controls="tarifsDetail">`);
    lines.push(`${INDENT}    <span>Voir le détail des offres suivies</span>`);
    lines.push(`${INDENT}    <span class="tarifs-toggle-chevron" aria-hidden="true">▼</span>`);
    lines.push(`${INDENT}</button>`);
    lines.push(`${INDENT}<div id="tarifsDetail" class="collapse">`);
    lines.push(`${INDENT}    <div class="tarifs-groups">`);
    for (const provider of providers) {
        lines.push(...renderGroup(provider, byProvider.get(provider), provider, null));
    }
    if (community.length) {
        lines.push(...renderGroup('Tarifs communautaires', community, null, COMMUNITY_NOTE));
    }
    lines.push(`${INDENT}    </div>`);
    lines.push(`${INDENT}</div>`);
    return lines.join('\n');
}

// -> { changes: [{ path, status }] }
export function run({ check = false, defs = listTarifDefs() } = {}) {
    const indexPath = path.join(REPO_ROOT, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    const next = replaceBetweenMarkers(html, BEGIN, END, `\n${generate(defs)}\n${INDENT}`, 'index.html');
    return { changes: [syncFile(indexPath, next, { check })] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const check = process.argv.includes('--check');
    const { changes } = run({ check });
    process.exitCode = reportChanges(changes, { check, what: 'Section « Tarifs suivis » d’index.html' });
}
