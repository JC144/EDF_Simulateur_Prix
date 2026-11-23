import { findKvaTables, extractConfiguredOffers } from '../lib/table.mjs';
import { pageToText } from '../lib/pdf-text.mjs';
import { findFrDate } from '../lib/dates.mjs';

import { discoverPdf } from '../lib/catalog-link.mjs';

export function discoverUrl() {
    return discoverPdf('https://symphonics.fr/grille-tarifaire-particulier/', /\/Grille-Tarifaire-Particulier[^/]*\.pdf$/i);
}

export function parse(doc) {
    const first = { pages: [doc.pages[0]] };
    const text = pageToText(first.pages[0]);
    if (!/00h-06h\s+et 14h-16h/.test(text)) throw new Error('Plages creuses Symphonics à vérifier');
    const config = { offer: 'Symphonics - Heures Creuses (solaire)', colCount: 6, abo: 1,
        prices: [[3, ['bleu.HP']], [5, ['bleu.HC']]] };
    return { gridDate: findFrDate(text), offers: extractConfiguredOffers(first, findKvaTables(first), [config], config.offer) };
}
