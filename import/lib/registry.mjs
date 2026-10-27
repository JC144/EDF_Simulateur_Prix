// Résolution URL de grille -> parser fournisseur.
// Un parser est un module de parsers/<fournisseur>.mjs exportant :
//   parse(doc, url) -> { gridDate, offers: { "<name defineTarif>": { subscriptions, dayTypes, priceOverrides? } } }
// La v1 ne gère que les price_url en PDF ; les pages HTML sont listées « non géré ».
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PARSERS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'parsers');

const PROVIDER_BY_HOST = {
    'particulier.edf.fr': 'edf',
    'particuliers.engie.fr': 'engie',
    'www.totalenergies.fr': 'total',
    'a.storyblok.com': 'octopus',
    'particuliers.alpiq.fr': 'alpiq',
    'doc.mint-energie.com': 'mint',
    'labellenergie.fr': 'labelleenergie',
};

// Grilles hébergées sur un host générique (stockage cloud partagé) : mapping
// par URL exacte, prioritaire sur le mapping par host.
const PROVIDER_BY_URL = {
    'https://storage.googleapis.com/sobry-legals/grille-tarifaire-sobry.pdf': 'sobry',
};

export function isPdfUrl(url) {
    return new URL(url).pathname.toLowerCase().endsWith('.pdf');
}

export function providerFor(url) {
    return PROVIDER_BY_URL[url] || PROVIDER_BY_HOST[new URL(url).host] || null;
}

// -> { provider, parser } | { provider, parser: null } (parser pas encore écrit)
//    | null (URL non PDF ou fournisseur inconnu : non géré)
export async function resolveParser(url) {
    if (!isPdfUrl(url)) return null;
    const provider = providerFor(url);
    if (!provider) return null;
    const modulePath = path.join(PARSERS_DIR, `${provider}.mjs`);
    if (!fs.existsSync(modulePath)) return { provider, parser: null };
    const parser = await import(new URL(`../parsers/${provider}.mjs`, import.meta.url));
    return { provider, parser };
}
