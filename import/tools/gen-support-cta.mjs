// Insère le composant statique avant publication pour que ses liens fonctionnent sans JavaScript.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT } from '../lib/tarif-defs.mjs';
import { replaceBetweenMarkers, reportChanges, syncFile } from '../lib/site-gen.mjs';

export function run({ check = false } = {}) {
    const component = fs.readFileSync(path.join(REPO_ROOT, 'components/support-cta.html'), 'utf8');
    const block = component.trimEnd().split(/\r?\n/).map(line => '    ' + line).join('\n');
    const indexPath = path.join(REPO_ROOT, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    const next = replaceBetweenMarkers(html, '<!-- SUPPORT-CTA:BEGIN -->', '<!-- SUPPORT-CTA:END -->',
        `\n${block}\n    `, 'index.html');
    return { changes: [syncFile(indexPath, next, { check })] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const check = process.argv.includes('--check');
    process.exitCode = reportChanges(run({ check }).changes, { check, what: 'Bandeau de soutien' });
}
