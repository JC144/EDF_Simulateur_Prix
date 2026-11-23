import assert from 'node:assert';
import { loadAbonnements } from './legacyLoader.mjs';

const abonnements = loadAbonnements();
export const byName = name => {
    const abo = abonnements.find(a => a.name === name);
    assert.ok(abo, `abonnement introuvable : ${name}`);
    return abo;
};
export const at = (hour, minute = 0) => ({ hour, minute });
