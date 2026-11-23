import { extractConfiguredOffers, findKvaTables } from '../lib/table.mjs';
import { pageToText } from '../lib/pdf-text.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { discoverPdf } from '../lib/catalog-link.mjs';

export const discoverUrl = () => discoverPdf('https://www.selia-energies.fr/offre-elec-vert-fixe/', /Grille-tarifaire-MCE-vert-fixe\.pdf$/i);

export function parse(doc) {
    const page = doc.pages[0];
    // Exclut la référence documentaire imprimée verticalement en marge.
    const grid = { pages: [{ ...page, items: page.items.filter(it => it.x < page.width * 0.80) }] };
    const text = pageToText(grid.pages[0]);
    if (!/Mon Contrat élec vert Fixe/i.test(text) || !/TTC en €/.test(text) || !/Heures creuses\s+Heures pleines/i.test(text)) throw new Error('Grille TTC Sélia inattendue');
    const name = 'Sélia - Mon Contrat Élec Vert Fixe (Deux-Sèvres)';
    const offers = extractConfiguredOffers(grid, findKvaTables(grid), [
        { offer: name + ' - Base', colCount: 2, abo: 0, prices: [[1, ['bleu.price']]] },
        { offer: name + ' - HP/HC', colCount: 3, abo: 0, prices: [[2, ['bleu.HP']], [1, ['bleu.HC']]] },
    ], name);
    return { gridDate: findFrDate(text), offers };
}
