import { pageToText, buildLines } from '../lib/pdf-text.mjs';
import { gridRow } from '../lib/residential-grid.mjs';
import { buildOffer } from '../lib/table.mjs';
import { findNumericDate } from '../lib/dates.mjs';
import { discoverPdf } from '../lib/catalog-link.mjs';

function family(url) {
    const match = /\/(ContratElec(?:Verte)?)_(HPHC|BASE)_\d{6}\.pdf$/i.exec(new URL(url).pathname);
    if (!match) throw new Error('Contrat Dyneff inconnu');
    return match;
}

export function discoverUrl(url) {
    const [, name, option] = family(url);
    return discoverPdf('https://www.dyneff-elec-gaz.fr/conditions-generales-dutilisation/', new RegExp('/' + name + '_' + option + '_\\d{6}\\.pdf$', 'i'));
}

export function parse(doc, url) {
    const [, name, option] = family(url);
    const hc = option.toUpperCase() === 'HPHC';
    const text = pageToText(doc.pages[0]);
    if (!/TARIFS DYNEFF ELECTRICITE/.test(text) || !/HTT\tTTC\tHTT\tTTC\tHTT\tTTC/.test(text)
        || hc !== /Heures pleines\s*\/\s*Heures creuses/i.test(text)) throw new Error('Grille résidentielle Dyneff inattendue');
    const lines = buildLines(doc.pages[0].items).map(l => l.cells).filter(c => /^(Entre \d+ et \d+|36)$/.test(c[0]));
    const rates = [];
    for (const cells of lines.filter(c => c.length > 3)) {
        if (cells.length !== 7) throw new Error('Colonnes TRV / Dyneff incomplètes');
        const c = cells.at(-1);
        if (hc && !c.startsWith(rates.length === 0 ? 'HP' : 'HC')) throw new Error('Ordre des prix HP/HC inattendu');
        rates.push(c.replace(/^(HP|HC)\s*:\s*/, ''));
    }
    if (rates.length !== (hc ? 2 : 1)) throw new Error('Prix Dyneff TTC incomplets');
    const rows = [];
    for (const [interval,, monthly] of lines) {
        const [min, max = min] = interval.match(/\d+/g).map(Number);
        for (let kva = Math.max(3, min); kva <= max; kva++) {
            if (kva !== (rows.at(-1)?.kva ?? (hc ? 5 : 2)) + 1) throw new Error('Tranches Dyneff discontinues');
            rows.push(gridRow(kva, monthly, ...rates));
        }
    }
    if (rows.at(-1)?.kva !== 36) throw new Error('Dernière puissance Dyneff manquante');
    const label = 'Dyneff - Contrat+ Électricité' + (/verte/i.test(name) ? ' Verte' : '') + (hc ? ' - HP/HC' : ' - Base');
    return { gridDate: findNumericDate(text), offers: { [label]: buildOffer(rows, hc ? [['bleu.HP'], ['bleu.HC']] : [['bleu.price']]) } };
}
