import path from 'node:path';

export function fixtureSlug(url) {
    return path.basename(new URL(url).pathname, '.pdf')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Un même PDF peut aussi décrire des offres que le simulateur ne suit plus.
export function trackedGrid(parsed, defs) {
    const names = new Set(defs.map(def => def.name));
    for (const name of names) {
        if (!Object.hasOwn(parsed.offers, name)) throw new Error('Offre absente de la grille : ' + name);
    }
    const offers = Object.fromEntries(Object.entries(parsed.offers).filter(([name]) => names.has(name)));
    return { ...parsed, offers };
}
