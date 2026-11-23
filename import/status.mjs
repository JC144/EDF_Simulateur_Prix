#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import { catalogStatus } from './lib/subscriptions.mjs';

export function printCatalogStatus({ active, total, providers, disabled }, { listDisabled = false } = {}) {
    console.log(`Catalogue · ${active} offre${active > 1 ? 's actives' : ' active'} sur ${total} tarif${total > 1 ? 's' : ''}`
        + ` · ${providers} fournisseur${providers > 1 ? 's' : ''}`);
    if (!listDisabled) return;
    if (!disabled.length) {
        console.log('Aucune offre à souscription désactivée.');
        return;
    }
    console.log(`\nOffres à souscription désactivée (${disabled.length})`);
    for (const { name, reason } of disabled) console.log(`  ${name} — ${reason}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    printCatalogStatus(catalogStatus(), { listDisabled: true });
}
