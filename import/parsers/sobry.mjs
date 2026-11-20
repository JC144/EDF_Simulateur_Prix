import { buildLines } from '../lib/pdf-text.mjs';
import { findFrDate } from '../lib/dates.mjs';
import { parseFrNumber, euroPerKwhToCents } from '../lib/fr-numbers.mjs';
import { KVAS } from '../lib/table.mjs';

export const provider = 'sobry';

// Le PDF espace parfois les lettres à l'intérieur d'un mot (« S o F le x »).
function compact(text) {
    return text.toLowerCase().normalize('NFD').replace(/\p{M}|\s/gu, '');
}

function number(text, pattern) {
    const match = text.match(pattern);
    if (!match) throw new Error(`Sobry : montant introuvable (${pattern})`);
    return parseFrNumber(match[1]);
}

function subscriptions(lines, gridDate, cta, tva) {
    // Le tableau résidentiel donne le total TTC hors CTA, sans isoler le
    // TURPE fixe. Assiette annuelle HT en contrat unique Linky, option CU4 :
    // gestion + comptage + soutirage (Enedis, TURPE 7, p. 17–19).
    // https://www.enedis.fr/media/4717/download
    if (gridDate < '2026-08-01' || gridDate >= '2027-08-01') {
        throw new Error('Sobry : vérifier le barème TURPE fixe CU4 applicable à la date de la grille');
    }
    const result = {};
    for (const { cells } of lines) {
        const [kva, cu4, mu4] = cells;
        if (!KVAS.includes(kva)) continue;
        const monthly = parseFrNumber(cu4);
        if (kva in result || cells.length !== 3 || !(monthly > 0) || !(parseFrNumber(mu4) > 0)) {
            throw new Error(`Sobry : abonnement TTC ambigu à ${kva} kVA`);
        }
        const turpeFixe = (17.12 + 22.67 + 10.42 * Number(kva)) / 12;
        result[kva] = Number((monthly + turpeFixe * cta * tva).toFixed(6));
    }
    if (Object.keys(result).length !== KVAS.length) throw new Error('Sobry : tableau CU4 incomplet');
    return result;
}

export function parse(doc) {
    const pages = doc.pages.map(p => {
        const lines = buildLines(p.items);
        return { lines, text: compact(lines.map(l => l.text).join('\n')) };
    });
    function pageWith(...labels) {
        const matches = pages.filter(p => labels.every(label => p.text.includes(label)));
        if (matches.length !== 1) throw new Error(`Sobry : page introuvable ou ambiguë (${labels.join(', ')})`);
        return matches[0];
    }
    const fixed = pageWith('particuliers', 'lapartfixe', 'contributiontarifaire');
    const dateLine = fixed.lines.find(l => /tarifs en vigueur au/i.test(l.text));
    const gridDate = dateLine && findFrDate(dateLine.text);
    if (!gridDate) throw new Error('Sobry : date des tarifs introuvable');
    const cta = number(fixed.text, /corresponda(\d+(?:,\d+)?)%duturpefixehtva/) / 100;
    const table = pageWith('particuliers', 'abonnementmensuelc5', 'tarifcu4-€/moistarifmu4', 'kvaabonnementttcabonnementttc');
    const variable = pageWith('particuliers', 'plafondtoutel', 'totalplafonne').text;
    const memo = pageWith('commentcalculermonkwh', 'valeursexprimeesen€/kwhttc', 'turpevariablemoyenhp/hc').text;

    // Le TURPE variable réglementé C5 est publié TTC pour les particuliers
    // et HTVA pour les professionnels de même puissance.
    const winterHp = /hiver·heurespleines(\d+,\d+)€\/kwh/;
    const residential = pageWith('particuliers', 'periodettc', 'hiver·heurespleines');
    const professional = pageWith('professionnels', '3→36kva', 'periodehtva', 'hiver·heurespleines');
    const tva = Number((number(residential.text, winterHp) / number(professional.text, winterHp)).toFixed(6));
    const htCents = ttc => euroPerKwhToCents(ttc / tva);
    const cap = htCents(number(variable, /soflexplafondtoutel['’]annee(\d+,\d+)€\/kwhttc/));
    const cee = number(variable, /cee\(certificatsd['’]economiesd['’]energie\)(\d+,\d+)€\/kwhttc/);
    const capacity = number(variable, /mecanismedecapacite(\d+,\d+)€\/kwhttc/);
    const spotFormula = {
        turpe: {
            hiver: htCents(number(memo, /turpevariablemoyenhp\/hcturpehiver:(\d+,\d+)€\/kwh/)),
            ete: htCents(number(memo, /·ete:(\d+,\d+)€\/kwh/)),
        },
        accise: htCents(number(residential.text, /accisesurl['’]electricite\(ex-ticfe\)(\d+,\d+)€\/kwhttc/)),
        cap: { hiver: cap, ete: cap },
        conformite: htCents(cee + capacity),
        marge: htCents(number(variable, /margesobry\([^)]*\)(\d+,\d+)€\/kwhttc/)),
        prime: htCents(number(variable, /primedecouverture\([^)]*\)soflex:(\d+,\d+)€\/kwhttc/)),
        tva,
    };
    return { gridDate, offers: { 'Sobry - SoFlex': { subscriptions: subscriptions(table.lines, gridDate, cta, tva), spotFormula } } };
}
