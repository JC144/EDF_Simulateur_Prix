import path from 'node:path';
import { REPO_ROOT } from './tarif-defs.mjs';
import { tarifSlug } from '../../scripts/utils/tarifMeta.js';

// Rapport console : une ligne de statut par URL de grille, puis un résumé.
const STATUS_LABELS = {
    'up-to-date': 'A JOUR',
    'modified': 'MODIFIE',
    'no-change': 'GRILLE CHANGEE, VALEURS IDENTIQUES',
    'unsupported': 'SOURCE NON GEREE',
    'no-parser': 'PARSER MANQUANT',
    'offer-missing': 'OFFRE INTROUVABLE',
    'patch-failed': 'VALEUR INTROUVABLE (patch refuse)',
    'manual': 'INTERVENTION MANUELLE REQUISE',
    'network-error': 'ERREUR RESEAU',
    'parse-error': 'ERREUR PARSING',
};

const ERROR_STATUSES = new Set(['offer-missing', 'patch-failed', 'network-error', 'parse-error', 'manual']);

export function makeReport() {
    const entries = [];
    const withdrawals = new Map();
    return {
        withdrawals,
        flagOffers(names, url, reason, kind = 'missing') {
            for (const name of names) {
                if (!withdrawals.has(name)) withdrawals.set(name, { name, url, reason, kind });
            }
        },
        add(url, status, details = '') {
            entries.push({ url, status, details });
            const label = STATUS_LABELS[status] || status;
            console.log(`[${label}] ${url}${details ? ` — ${details}` : ''}`);
        },
        summary() {
            const counts = {};
            for (const e of entries) counts[e.status] = (counts[e.status] || 0) + 1;
            console.log('\n--- Résumé ---');
            for (const [status, count] of Object.entries(counts)) {
                console.log(`${STATUS_LABELS[status] || status} : ${count}`);
            }
            return entries;
        },
        hasErrors() {
            return entries.some(e => ERROR_STATUSES.has(e.status));
        },
        modifiedFiles: new Set(),
    };
}

export function printWithdrawals(findings) {
    if (!findings.length) {
        console.log('\nAucun retrait d’offre signalé par cet import.');
        return;
    }
    const cwd = (process.env.npm_lifecycle_event && process.env.INIT_CWD) || process.cwd();
    const inImport = path.resolve(cwd) === path.join(REPO_ROOT, 'import');
    const script = inImport ? 'remove.mjs' : 'import/remove.mjs';
    console.log('\n--- Disponibilité des offres ---');
    if (!inImport && path.resolve(cwd) !== REPO_ROOT) console.log('Commandes à lancer depuis la racine du dépôt.');
    const headings = {
        closed: 'Offres fermées à la souscription selon le fournisseur',
        expired: 'Périodes de souscription expirées — vérifier si une nouvelle grille a été publiée',
        missing: 'Retraits à confirmer auprès du fournisseur avant suppression',
    };
    for (const [kind, heading] of Object.entries(headings)) {
        const group = findings.filter(f => f.kind === kind).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        if (!group.length) continue;
        console.log(heading);
        for (const { name, url, reason } of group) {
            console.log(`  ${name} — ${reason}\n    ${url}\n    node ${script} --tarif ${tarifSlug(name)} --apply`);
        }
    }
}
