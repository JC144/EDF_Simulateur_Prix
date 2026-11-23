// Patch textuel ciblé des littéraux defineTarif({...}) : on remplace des
// valeurs scalaires (nombre ou chaîne) repérées par leur chemin dans l'objet,
// UNIQUEMENT si la valeur actuelle du source correspond à l'ancienne valeur
// attendue. Jamais de réécriture globale : commentaires, dayRule, hcRanges
// et mise en forme sont préservés à l'octet près.
//
// Hypothèse garantie par defineTarif : les champs patchés sont des littéraux
// purs (objets/nombres/chaînes), sans fonctions ni expressions.

import { isDeepStrictEqual } from 'node:util';
import { loadDefsFromSource } from './revalidate.mjs';

const IDENT_CHAR = /[A-Za-z0-9_$]/;

function isQuote(ch) {
    return ch === '"' || ch === "'" || ch === '`';
}

// Fin d'une chaîne commençant en i (src[i] est le quote ouvrant).
function skipString(src, i) {
    const quote = src[i];
    i++;
    while (i < src.length) {
        if (src[i] === '\\') i += 2;
        else if (src[i] === quote) return i + 1;
        else i++;
    }
    throw new Error('chaîne non terminée');
}

// Avance après les espaces et commentaires.
function skipWs(src, i) {
    while (i < src.length) {
        const ch = src[i];
        if (/\s/.test(ch)) i++;
        else if (ch === '/' && src[i + 1] === '/') {
            while (i < src.length && src[i] !== '\n') i++;
        } else if (ch === '/' && src[i + 1] === '*') {
            const end = src.indexOf('*/', i + 2);
            if (end === -1) throw new Error('commentaire non terminé');
            i = end + 2;
        } else break;
    }
    return i;
}

// src[i] est un ouvrant '{', '[' ou '(' : renvoie l'index du fermant associé.
function findMatching(src, i) {
    const open = src[i];
    const close = { '{': '}', '[': ']', '(': ')' }[open];
    let depth = 0;
    while (i < src.length) {
        const ch = src[i];
        if (isQuote(ch)) {
            i = skipString(src, i);
            continue;
        }
        if (ch === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) {
            i = skipWs(src, i);
            continue;
        }
        if (ch === open) depth++;
        else if (ch === close) {
            depth--;
            if (depth === 0) return i;
        }
        i++;
    }
    throw new Error(`${open} non refermé`);
}

// Fin de la valeur commençant en i (déjà hors espaces) : objet/tableau
// équilibré, chaîne, ou scalaire jusqu'à la virgule / fermant de même niveau.
function valueEnd(src, i, stopIndex) {
    const ch = src[i];
    if (ch === '{' || ch === '[') return findMatching(src, i) + 1;
    if (isQuote(ch)) return skipString(src, i);
    let j = i;
    while (j < stopIndex && src[j] !== ',' && src[j] !== '}' && src[j] !== ']') j++;
    while (j > i && /\s/.test(src[j - 1])) j--;
    return j;
}

// Cherche la clé `key` au premier niveau de l'objet délimité par
// objStart ('{') .. objEnd ('}') -> { valueStart, valueEnd } | null
function findKeyValue(src, objStart, objEnd, key) {
    let i = objStart + 1;
    while (i < objEnd) {
        i = skipWs(src, i);
        if (i >= objEnd) break;
        if (src[i] === ',') { i++; continue; }

        // Lecture du token clé : identifiant, nombre ou chaîne.
        const keyStart = i;
        let keyText = null;
        if (isQuote(src[i])) {
            const end = skipString(src, i);
            keyText = src.slice(i + 1, end - 1);
            i = end;
        } else {
            let j = i;
            while (j < objEnd && IDENT_CHAR.test(src[j])) j++;
            if (j === i) throw new Error(`token inattendu "${src[i]}" à l'offset ${i}`);
            keyText = src.slice(i, j);
            i = j;
        }
        i = skipWs(src, i);
        if (src[i] !== ':') throw new Error(`":" attendu après la clé "${keyText}"`);
        i = skipWs(src, i + 1);
        const end = valueEnd(src, i, objEnd);
        if (keyText === String(key)) return { keyStart, valueStart: i, valueEnd: end };
        i = end;
    }
    return null;
}

// Tous les blocs defineTarif({ ... }) du fichier -> [{ objStart, objEnd }]
function findDefineTarifBlocks(src) {
    const blocks = [];
    let i = 0;
    while (i < src.length) {
        const ch = src[i];
        if (isQuote(ch)) { i = skipString(src, i); continue; }
        if (ch === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) { i = skipWs(src, i); continue; }
        if (src.startsWith('defineTarif', i)
            && !(i > 0 && IDENT_CHAR.test(src[i - 1]))
            && !IDENT_CHAR.test(src[i + 'defineTarif'.length])) {
            let j = skipWs(src, i + 'defineTarif'.length);
            if (src[j] === '(') {
                j = skipWs(src, j + 1);
                if (src[j] === '{') {
                    const objEnd = findMatching(src, j);
                    blocks.push({ start: i, objStart: j, objEnd });
                    i = objEnd + 1;
                    continue;
                }
            }
        }
        i++;
    }
    return blocks;
}

function blockName(src, block) {
    const loc = findKeyValue(src, block.objStart, block.objEnd, 'name');
    if (!loc || !isQuote(src[loc.valueStart])) return null;
    return src.slice(loc.valueStart + 1, loc.valueEnd - 1);
}

// Retire les appels déclaratifs sélectionnés en conservant le source des voisins.
export function removeTarifBlocks(source, names) {
    const remaining = new Set(names);
    for (const block of findDefineTarifBlocks(source).reverse()) {
        if (!remaining.delete(blockName(source, block))) continue;
        let end = skipWs(source, block.objEnd + 1);
        if (source[end++] !== ')') throw new Error('Fin de defineTarif introuvable');
        if (source[end] === ';') end++;
        end += /^(?:[ \t]*\r?\n){0,2}/.exec(source.slice(end))[0].length;
        source = source.slice(0, block.start) + source.slice(end);
    }
    if (remaining.size) throw new Error('Bloc defineTarif introuvable : ' + [...remaining].join(', '));
    return source;
}

// Descend le chemin (ex. ["priceOverrides","3","bleu","price"]) dans le bloc
// -> { valueStart, valueEnd } | null
function locateValue(src, block, path) {
    let { objStart, objEnd } = block;
    for (let depth = 0; depth < path.length; depth++) {
        const loc = findKeyValue(src, objStart, objEnd, path[depth]);
        if (!loc) return null;
        if (depth === path.length - 1) return loc;
        if (src[loc.valueStart] !== '{') return null;
        objStart = loc.valueStart;
        objEnd = loc.valueEnd - 1;
    }
    return null;
}

function parseScalar(raw) {
    if (isQuote(raw[0])) return raw.slice(1, -1);
    const n = Number(raw);
    return Number.isNaN(n) ? raw : n;
}

function formatScalar(newValue, oldRaw) {
    if (typeof newValue === 'string') {
        const quote = isQuote(oldRaw[0]) ? oldRaw[0] : '"';
        return `${quote}${newValue}${quote}`;
    }
    return String(newValue);
}

// La règle facultative peut apparaître, changer ou disparaître à chaque édition.
function patchSubscriptionRule(src, block, tarifName, change) {
    const actual = loadDefsFromSource(src, tarifName).find(def => def.name === tarifName).subscriptionRule;
    if (!isDeepStrictEqual(structuredClone(actual), structuredClone(change.old))) {
        throw new Error('règle de souscription modifiée depuis la lecture du tarif');
    }
    const loc = locateValue(src, block, ['subscriptionRule']);
    if (change.new === undefined) {
        if (!loc) return src;
        const comma = skipWs(src, loc.valueEnd);
        if (src[comma] !== ',') return src.slice(0, loc.keyStart) + src.slice(loc.valueEnd);
        const beforeComma = src.slice(loc.valueEnd, comma);
        return src.slice(0, loc.keyStart) + beforeComma + src.slice(comma + 1).trimStart();
    }
    const fields = Object.entries(change.new).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
    const literal = '{ ' + fields.join(', ') + ' }';
    if (loc) return src.slice(0, loc.valueStart) + literal + src.slice(loc.valueEnd);
    const anchor = locateValue(src, block, ['subscription_url']).keyStart;
    const indent = /(?:\r?\n)?[ \t]*$/.exec(src.slice(0, anchor))[0];
    return src.slice(0, anchor) + 'subscriptionRule: ' + literal + ',' + indent + src.slice(anchor);
}

// changes: [{ path: ["subscriptions","6"], old: 15.65, new: 15.79 }, ...]
// -> { source, applied: [...], failed: [{ ...change, reason }] }
// Aucune écriture disque ici : le fichier n'est réécrit par l'appelant que
// si `failed` est vide (tout-ou-rien).
export function patchTarifFile(source, tarifName, changes) {
    const applied = [];
    const failed = [];
    let src = source;

    for (const change of changes) {
        // Les offsets bougent à chaque remplacement : on relocalise le bloc
        // et la valeur à chaque itération.
        const block = findDefineTarifBlocks(src).find(b => blockName(src, b) === tarifName);
        if (!block) {
            failed.push({ ...change, reason: `bloc defineTarif "${tarifName}" introuvable` });
            continue;
        }
        if (change.path.length === 1 && change.path[0] === 'subscriptionRule') {
            try {
                src = patchSubscriptionRule(src, block, tarifName, change);
                applied.push(change);
            } catch (err) {
                failed.push({ ...change, reason: err.message });
            }
            continue;
        }
        const loc = locateValue(src, block, change.path);
        if (!loc) {
            failed.push({ ...change, reason: `chemin ${change.path.join('.')} introuvable` });
            continue;
        }
        const raw = src.slice(loc.valueStart, loc.valueEnd);
        const current = parseScalar(raw);
        if (current !== change.old) {
            failed.push({ ...change, reason: `valeur actuelle ${JSON.stringify(current)} ≠ attendue ${JSON.stringify(change.old)}` });
            continue;
        }
        src = src.slice(0, loc.valueStart) + formatScalar(change.new, raw) + src.slice(loc.valueEnd);
        applied.push(change);
    }
    return { source: src, applied, failed };
}
