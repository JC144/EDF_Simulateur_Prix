export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

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

