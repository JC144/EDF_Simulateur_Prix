import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { parseFrNumber } from '../lib/fr-numbers.mjs';
import { buildOffer } from '../lib/table.mjs';
import { fetchGrille, findInCache } from '../lib/download.mjs';

// Les tableaux Enedis sont des images dans ce PDF. Une nouvelle édition
// déclenche une revue avant de réutiliser les coefficients vérifiés ci-dessous.
const turpeUrl = 'https://www.enedis.fr/media/4717/download';
const turpeHash = '9d72302f9a9ffdaaa4547a547f2e59f9f72e1c0210a85e309de0ffd0ab0e7d05';
const periods = { CU4: [7.72, 4.09, 1.71, 1.20], MU4: [7.21, 3.84, 1.66, 1.14] };
// Tarifs normaux au 1er août 2026, loi de finances 2026, formulaire DGFiP 2040-TIC-SD.
const duty = 3.062;
const vat = 1.20;

export async function checkInputs(offline, today) {
    if (today > '2027-01-31') throw new Error('Actualiser l’accise résidentielle applicable après le 31 janvier 2027');
    const file = offline ? findInCache(turpeUrl, turpeHash) : (await fetchGrille(turpeUrl)).cachePath;
    if (!file || createHash('sha256').update(fs.readFileSync(file)).digest('hex') !== turpeHash) {
        throw new Error('Vérifier les coefficients de la nouvelle grille TURPE d’Enedis');
    }
}

export function parse(doc) {
    const terms = doc.pages.map(page => pageToText(page)).join('\n').replace(/\s/g, '').toLowerCase();
    const margin = parseFrNumber(terms.match(/epexday-ahead\/kwh\+(\d+[,.]\d+)€/i)?.[1]);
    const fee = parseFrNumber(terms.match(/prixdel’abonnement\(€\/mois\):(\d+[,.]\d+)€\(ttc\)/)?.[1]);
    if (margin === null || fee === null || !terms.includes('tva(20%)') || !terms.includes('cta(15%)')) {
        throw new Error('Formule Frank Énergie ou fiscalité à vérifier');
    }
    const lines = doc.pages.flatMap(page => buildLines(page.items));
    const start = lines.findIndex(line => /Tarifs Mensuels TTC/i.test(line.text));
    if (start < 0) throw new Error('Abonnements Frank absents');
    const rows = lines.slice(start).filter(line => /^\d+$/.test(line.cells[0]) && line.cells.length === 5);
    if (rows.length !== 34) throw new Error('Abonnements Frank incomplets');
    const offers = {};
    for (const [i, [option, rates]] of Object.entries(periods).entries()) {
        const printed = lines.find(line => line.cells[0].startsWith(option + ' ('));
        const values = printed?.cells.slice(1).map(parseFrNumber) || [];
        if (values.length !== 4 || rates.some((c, j) => Math.abs(values[j] * 100 - c) > 0.00001)) {
            throw new Error('Écart entre Frank et Enedis sur les périodes ' + option);
        }
        const extras = rates.map(c => Number(((margin * 100 + c + duty) * vat).toFixed(6)));
        offers['Frank Énergie - Dynamique ' + option] = buildOffer(rows.filter(r => Number(r.cells[0]) < 36).map(row => {
            const kva = row.cells[0];
            const network = parseFrNumber(row.cells[1 + 2 * i]);
            const expected = (17.12 + 22.67 + Number(kva) * [10.42, 12.49][i]) * 1.15 * vat / 12;
            if (network === null || Math.abs(network - expected) > 0.011) throw new Error('Écart sur le TURPE fixe : ' + kva);
            return { kva, values: [Number((fee + network).toFixed(2)), ...extras] };
        }), [['hiver.HP'], ['hiver.HC'], ['ete.HP'], ['ete.HC']]);
    }
    // La fiche commerciale ne porte pas de date. L’import enregistre la date du constat.
    return { gridDate: null, offers };
}

export async function discoverUrl() {
    const { buffer } = await fetchGrille('https://www.frankenergie.fr/fr/tarification-dynamique');
    const links = [...buffer.toString('utf8').matchAll(/href="(https:\/\/cdn\.sanity\.io\/files\/8navd656\/production-fr\/[a-f0-9]+\.pdf)">\s*<p[^>]*>Tarifs<\/p>/gi)];
    const targets = new Set(links.map(match => match[1]));
    if (targets.size !== 1) throw new Error('Lien Tarifs Frank Énergie absent ou ambigu');
    return [...targets][0];
}
