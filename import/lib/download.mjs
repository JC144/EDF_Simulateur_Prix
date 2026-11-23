// Téléchargement d'une grille tarifaire avec requête conditionnelle et
// cache disque. Le SHA-256 du corps est la source de vérité pour la
// détection de changement (les ETags des CDN ne sont pas fiables).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const CACHE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'cache');

// Certains serveurs (EDF notamment) refusent les User-Agent non navigateur.
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/pdf,text/html;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9',
};

export function cachePathFor(url, sha256) {
    const basename = path.basename(new URL(url).pathname) || 'grille';
    return path.join(CACHE_DIR, `${sha256.slice(0, 8)}-${basename}`);
}

// -> { status: 'not-modified' } | { status: 'ok', sha256, buffer, cachePath, etag, lastModified }
// Lève en cas d'erreur réseau ou HTTP.
export async function fetchGrille(url, { etag, lastModified, force = false } = {}) {
    const headers = { ...HEADERS };
    if (!force && etag) headers['If-None-Match'] = etag;
    if (!force && lastModified) headers['If-Modified-Since'] = lastModified;

    const res = await fetch(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (res.status === 304) return { status: 'not-modified' };
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const cachePath = cachePathFor(url, sha256);
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    if (!fs.existsSync(cachePath)) fs.writeFileSync(cachePath, buffer);
    return {
        status: 'ok',
        sha256,
        buffer,
        cachePath,
        etag: res.headers.get('etag') || undefined,
        lastModified: res.headers.get('last-modified') || undefined,
    };
}

// Mode --offline : retrouve dans le cache le fichier correspondant au sha256
// connu du manifest (ou, à défaut, le plus récent pour ce basename).
export function findInCache(url, sha256) {
    if (!fs.existsSync(CACHE_DIR)) return null;
    const basename = path.basename(new URL(url).pathname) || 'grille';
    if (sha256) {
        const exact = cachePathFor(url, sha256);
        return fs.existsSync(exact) ? exact : null;
    }
    const candidates = fs.readdirSync(CACHE_DIR)
        .filter(f => f.endsWith(`-${basename}`))
        .map(f => path.join(CACHE_DIR, f))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    return candidates[0] || null;
}
