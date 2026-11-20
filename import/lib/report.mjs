// Rapport console : une ligne de statut par URL de grille, puis un résumé.
const STATUS_LABELS = {
    'up-to-date': 'A JOUR',
    'modified': 'MODIFIE',
    'no-change': 'GRILLE CHANGEE, VALEURS IDENTIQUES',
    'unsupported': 'SOURCE NON GEREE',
    'private-grid': 'GRILLE PRIVÉE, DERNIÈRE GRILLE PUBLIQUE CONSERVÉE',
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
    return {
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
