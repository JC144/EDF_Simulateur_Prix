// Aides partagées par les générateurs de HTML statique du site
// (tools/gen-tarifs-section.mjs, tools/gen-tarif-pages.mjs) : noms de
// fournisseurs, formats français, réécriture idempotente de fichiers.
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './tarif-defs.mjs';

// Dossier de scripts/tarifs/ -> nom commercial affiché. Un dossier absent de
// cette table fait échouer la génération : à compléter à chaque nouveau
// fournisseur.
export const PROVIDERS = {
    alpiq: 'Alpiq',
    alterna: 'Alterna',
    edf: 'EDF',
    enercoop: 'Enercoop',
    engie: 'Engie',
    labelleenergie: 'La Bellenergie',
    mint: 'Mint Énergie',
    sobry: 'Sobry',
    total: 'TotalEnergies',
};

// Avertissement des tarifs maintenus par la communauté (section d'accueil et
// pages de grille).
export const COMMUNITY_NOTE = 'Ces tarifs sont maintenus par la communauté et peuvent ne pas être à jour :'
    + ' vérifiez-les sur le site du fournisseur avant toute décision.';

export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// 0 = dimanche ... 6 = samedi (convention Date#getDay et dayRule)
export const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function escapeHtml(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

// "2026-02-01" -> "1er février 2026"
export function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const day = d === 1 ? '1er' : String(d);
    return `${day} ${MOIS[m - 1]} ${y}`;
}

// Nombre au format français, 2 à 4 décimales (certaines grilles publient
// 3 ou 4 décimales : ne jamais tronquer l'information).
const NUMBER_FORMAT = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
export function formatNumber(n) {
    return NUMBER_FORMAT.format(n);
}

// "22:00" -> "22h00" ; minutes -> "22h00" (1440 = "24h00")
export function formatHour(value) {
    const minutes = typeof value === 'number' ? value : toMinutes(value);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;
}

export function toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

export function providerOf(def) {
    const folder = def.file.split('/')[2];
    const name = PROVIDERS[folder];
    if (!name) throw new Error(`Fournisseur inconnu « ${folder} » (${def.file}) : compléter PROVIDERS dans import/lib/site-gen.mjs`);
    return name;
}

// "EDF - Tempo" sous le fournisseur « EDF » -> "Tempo" ; sinon nom complet
// (provider null = liste sans regroupement, on garde le nom complet).
export function offerLabel(def, provider) {
    if (!provider) return def.name;
    const prefix = `${provider} - `;
    return def.name.startsWith(prefix) ? def.name.slice(prefix.length) : def.name;
}

export function detectEol(text) {
    return text.includes('\r\n') ? '\r\n' : '\n';
}

function lf(text) {
    return text.replaceAll('\r\n', '\n');
}

// Remplace le contenu strictement compris entre deux marqueurs uniques.
// inner est en LF, converti aux fins de ligne du texte.
export function replaceBetweenMarkers(text, begin, end, inner, label = 'fichier') {
    const begins = text.split(begin).length - 1;
    const ends = text.split(end).length - 1;
    if (begins !== 1 || ends !== 1) {
        throw new Error(`Marqueurs ${begin} / ${end} introuvables ou dupliqués dans ${label} (${begins}/${ends}).`);
    }
    const start = text.indexOf(begin) + begin.length;
    const stop = text.indexOf(end);
    if (stop < start) throw new Error(`Marqueur END avant BEGIN dans ${label}.`);
    return text.slice(0, start) + inner.replaceAll('\n', detectEol(text)) + text.slice(stop);
}

// Écrit content (LF) si le fichier diffère, en conservant les fins de ligne
// d'un fichier existant (CRLF sous Windows avec core.autocrlf) ; la
// comparaison ignore les fins de ligne. check = ne rien écrire.
// -> { path (relatif au repo), status: 'unchanged' | 'written' | 'outdated' }
export function syncFile(absPath, content, { check = false, eol = '\r\n' } = {}) {
    const rel = path.relative(REPO_ROOT, absPath).replaceAll('\\', '/');
    const exists = fs.existsSync(absPath);
    const current = exists ? fs.readFileSync(absPath, 'utf8') : null;
    if (exists && lf(current) === lf(content)) return { path: rel, status: 'unchanged' };
    if (check) return { path: rel, status: 'outdated' };
    const targetEol = exists ? detectEol(current) : eol;
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, lf(content).replaceAll('\n', targetEol));
    return { path: rel, status: 'written' };
}

// Point d'entrée CLI commun : affiche les changements, exit 1 en --check si
// quelque chose est à régénérer.
export function reportChanges(changes, { check, what }) {
    const dirty = changes.filter(c => c.status !== 'unchanged');
    if (dirty.length === 0) {
        console.log(`${what} : déjà à jour.`);
        return 0;
    }
    for (const c of dirty) console.log(`  ${c.status.padEnd(9)} ${c.path}`);
    if (check) {
        console.error(`${what} : ${dirty.length} fichier(s) obsolète(s) (relancer sans --check : cd import && npm run gen).`);
        return 1;
    }
    console.log(`${what} : ${dirty.length} fichier(s) régénéré(s).`);
    return 0;
}
