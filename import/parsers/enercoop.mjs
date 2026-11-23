import { buildLines } from '../lib/pdf-text.mjs';
import { findApplicableDate } from '../lib/dates.mjs';
import { extractConfiguredOffers, findKvaTables } from '../lib/table.mjs';
import { uniqueGridUrl } from '../lib/catalog-link.mjs';

export const provider = 'enercoop';

// L'identifiant de la pièce jointe change à chaque édition. L'article reste stable
// et contient aussi une annexe professionnelle publiée le même jour.
export async function discoverUrl() {
    const response = await fetch('https://www.faq.enercoop.fr/api/v2/help_center/fr/articles/360024967152/attachments.json',
        { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Annexes Enercoop : HTTP ${response.status}`);
    return residentialAttachment(await response.json());
}

export function residentialAttachment({ article_attachments }) {
    const matches = article_attachments.filter(a => a.content_type === 'application/pdf'
        && /annexes? tarifaires?.*particuliers?/i.test(a.file_name));
    if (matches.length > 1 || matches.some(a => !Number.isSafeInteger(a.id))) {
        throw new Error('Annexe tarifaire particuliers Enercoop absente ou ambiguë');
    }
    return uniqueGridUrl(new Set(matches.map(a => `https://www.faq.enercoop.fr/hc/fr/article_attachments/${a.id}`)),
        'https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires');
}

const seasonalPrices = [
    ['hiver.HP'], ['hiver.HC', 'hiverWeekend.HP', 'hiverWeekend.HC'],
    ['ete.HP'], ['ete.HC', 'eteWeekend.HP', 'eteWeekend.HC'],
];
const configs = [
    { title: /(?:Basic Watt|Offre)\s*-\s*base/i, offer: 'Enercoop - Base', prices: [['bleu.price']] },
    { title: /(?:Flexi Watt|Flexibilité)\s*-\s*heures creuses/i, offer: 'Enercoop - Flexibilité - heures creuses',
        prices: [['bleu.HP'], ['bleu.HC']] },
    { title: /(?:Flexi Watt|Flexibilité)\s*-\s*nuit & week-end/i, offer: 'Enercoop - Flexibilité - nuit & week-end',
        prices: [['bleu.HP'], ['bleu.HC', 'weekend.HP', 'weekend.HC']] },
    { title: /(?:Flexi Watt|Flexibilité)\s*-\s*2 saisons/i, offer: 'Enercoop - Offre Flexibilité 2 Saisons', prices: seasonalPrices },
    { title: /option\s*["“«]?jours? de pointe/i, offer: 'Enercoop - Flexibilité 2 saisons - Jours de pointe',
        prices: [['hiver.HP'], [...seasonalPrices[1], 'hiverPointe.HC'], ['ete.HP'],
            [...seasonalPrices[3], 'etePointe.HC'], ['hiverPointe.HP', 'etePointe.HP']] },
];

function gridHeader(doc, table) {
    const lines = buildLines(doc.pages[table.page].items, { yTolerance: 4 });
    const header = lines.filter(l => l.y > table.yTop).map(l => l.text).join('\n');
    // L’option Jours de pointe reprend le titre de l’offre 2 saisons.
    return { lines, header, config: configs.findLast(c => c.title.test(header)), closed: /offre fermée à la souscription/i.test(header) };
}

export function subscriptionCheck() {
    return doc => {
        const closures = new Set();
        const open = new Set();
        for (const table of findKvaTables(doc)) {
            const { closed, config } = gridHeader(doc, table);
            if (!config) continue;
            if (closed) closures.add(config.offer);
            else open.add(config.offer);
        }
        return [{ names: [...closures].filter(name => !open.has(name)), kind: 'closed', reason: 'Offre indiquée comme fermée à la souscription' }];
    };
}

export function parse(doc) {
    const offers = {};
    const closedOffers = new Set();
    let gridDate = null;
    for (const table of findKvaTables(doc)) {
        const { lines, header, config, closed } = gridHeader(doc, table);
        if (closed) {
            if (config) closedOffers.add(config.offer);
            continue;
        }
        if (!config || offers[config.offer]) throw new Error(`Grille Enercoop inconnue ou en double, page ${table.page + 1}`);
        const date = findApplicableDate(lines);
        if (!date || (gridDate && date !== gridDate)) throw new Error('Date de grille Enercoop absente ou incohérente');
        gridDate = date;

        const pairs = 1 + config.prices.length;
        const columns = header.match(/\b(?:HTT|TTC)\b/g) || [];
        const periods = header.match(/Heures (?:pleines|creuses)/g) || [];
        const expectedPeriods = config.prices.length === 1 ? [] : Array(pairs < 5 ? 1 : 2).fill('Heures pleines Heures creuses');
        if (columns.join(' ') !== Array(pairs).fill('HTT TTC').join(' ')
            || periods.join(' ') !== expectedPeriods.join(' ')
            || (pairs >= 5 && !/HIVER[^\n]*[ÉE]T[ÉE]/i.test(header))) {
            throw new Error(`${config.offer} : ordre des colonnes tarifaires inattendu`);
        }
        // Seuls les prix du kWh sont fusionnés. Un abonnement manquant ne doit
        // jamais être interpolé par l'extracteur de cellules fusionnées.
        const rows = lines.filter(l => /^\d{1,2}$/.test(l.cells[0]));
        if (rows.length !== 36 || rows.some((l, i) => Number(l.cells[0]) !== i + 1 || l.cells.length < 3
            || !l.cells.slice(1, 3).every(v => /^\d+,\d{2}\s*€$/.test(v)))) {
            throw new Error(`${config.offer} : abonnements de 1 à 36 kVA incomplets`);
        }
        Object.assign(offers, extractConfiguredOffers(doc, [table], [{
            offer: config.offer, abo: 1, colCount: pairs * 2,
            prices: config.prices.map((paths, i) => [3 + i * 2, paths]),
        }], 'Enercoop'));
    }
    if (configs.some(c => !offers[c.offer] && !closedOffers.has(c.offer))) throw new Error('Grilles Enercoop ouvertes incomplètes');
    return { gridDate, offers };
}
