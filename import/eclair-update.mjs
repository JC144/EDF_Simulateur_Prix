import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { findFrDate } from './lib/dates.mjs';
import { fetchGrille, findInCache } from './lib/download.mjs';

const url = 'https://www.totalenergies.fr/particuliers/electricite/offres-d-electricite/offre-heures-eco-plus-electricite/historique-jours-eclair';
const dest = new URL('../scripts/tarifs-lib/calendars/total-eclair.js', import.meta.url);
const { values: opts } = parseArgs({ options: { 'dry-run': { type: 'boolean' }, offline: { type: 'boolean' } } });
const file = opts.offline ? findInCache(url) : (await fetchGrille(url)).cachePath;
if (!file) throw new Error('Historique Éclair absent du cache');
const html = fs.readFileSync(file, 'utf8');
const days = [];
const coverage = [];
// Une archive en cache ne permet pas d’attester des jours postérieurs à son acquisition.
const asOf = (opts.offline ? fs.statSync(file).mtime : new Date()).toISOString().slice(0, 10).replaceAll('-', '/');
const years = new Set();
for (const match of html.matchAll(/<a[^>]*accordion-title[^>]*>\s*(20\d\d)\s*<\/a>\s*<div[^>]*>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi)) {
    const [, year, list] = match;
    if (years.has(year)) throw new Error('Année Éclair en double : ' + year);
    years.add(year);
    const dates = [...list.matchAll(/<li>([^<>]+)<\/li>/gi)].map(item => {
        const parsed = findFrDate(item[1] + ' ' + year);
        if (!parsed) throw new Error('Date Éclair inconnue : ' + item[1]);
        return parsed.replaceAll('-', '/');
    });
    // Le fournisseur annonce 20 jours par année civile. Une archive close
    // plus courte laisse les périodes hivernales sans statut certain.
    if (year === asOf.slice(0, 4) || dates.length === 20) {
        coverage.push([year + '/01/01', year === asOf.slice(0, 4) ? asOf : year + '/12/31']);
    } else {
        coverage.push([year + '/04/16', year + '/10/14']);
    }
    days.push(...dates);
}
if (!days.length || new Set(days).size !== days.length) throw new Error('Historique Éclair absent ou ambigu');
const calendar = { eclair: { numberOfDays: 20, monthBegin: 10, monthEnd: 4, days: days.sort(), coverage: coverage.sort() } };
const contents = '// Généré par import/eclair-update.mjs depuis l’historique TotalEnergies.\n'
    + 'defineCalendar("total-eclair", ' + JSON.stringify(calendar, null, 4) + ');\n';
if (fs.existsSync(dest)) {
    const before = fs.readFileSync(dest, 'utf8');
    const oldDays = JSON.parse(before.slice(before.indexOf(', {') + 2, before.lastIndexOf(');'))).eclair.days;
    if (oldDays.some(date => !days.includes(date))) throw new Error('Des dates Éclair publiées ont disparu : vérifier la source');
}
if (!opts['dry-run']) fs.writeFileSync(dest, contents);
console.log(days.length + ' jours Éclair publiés, calendrier vérifié au ' + asOf);
