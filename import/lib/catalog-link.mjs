// Sélectionne une seule grille parmi les liens du catalogue public du fournisseur.
export function uniqueGridUrl(urls, page) {
    if (!urls.size) throw Object.assign(new Error('Grille absente du catalogue ' + page), { code: 'GRID_NOT_LISTED', page });
    if (urls.size > 1) throw new Error('Grille ambiguë dans ' + page);
    return [...urls][0];
}

export async function discoverPdf(page, pattern, { before } = {}) {
    const response = await fetch(page, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Catalogue ${page} : HTTP ${response.status}`);
    const urls = new Set();
    let html = await response.text();
    if (before) {
        const end = html.search(before);
        if (end < 0) throw new Error('Rubrique des archives introuvable dans ' + page);
        html = html.slice(0, end);
    }
    for (const [, href] of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
        const url = new URL(href.replaceAll('&amp;', '&'), page);
        if (url.origin === new URL(page).origin && pattern.test(url.pathname)) urls.add(url.href);
    }
    return uniqueGridUrl(urls, page);
}
