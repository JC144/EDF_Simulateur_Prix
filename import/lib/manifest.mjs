// État persistant de la détection de mise à jour, une entrée par URL unique :
// { sha256, etag, lastModified, lastChecked, lastApplied, subscriptionRules? }
// `sha256` est le hash du dernier PDF RÉCONCILIÉ avec le repo (patch appliqué
// ou constat « valeurs identiques ») — un simple check ne le met jamais à jour.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MANIFEST_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'manifest.json');

export function loadManifest() {
    if (!fs.existsSync(MANIFEST_PATH)) return {};
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

export function saveManifest(manifest) {
    const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n');
}
