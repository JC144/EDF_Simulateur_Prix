#!/usr/bin/env node
// Synchro MANUELLE des prix spot FR (energy-charts.info, licence CC BY 4.0).
// Usage : node tools/update-spot-prices.js [annéesHistorique]
// Régénère data/spot-fr.json (grille UTC continue, pas de 15 min, €/MWh).
const fs = require('node:fs');
const path = require('node:path');

// Sortie en .js (et non .json) → chargée via <script> dans index.html, car l'app
// peut être ouverte en file:// où fetch() est bloqué par le navigateur.
const OUT = path.join(__dirname, '..', 'data', 'spot-fr.js');
const STEP = 900; // 15 min en secondes
const YEARS = Number(process.argv[2] || 3);

function isoDay(d) { return d.toISOString().slice(0, 10); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchRange(startDay, endDay) {
    const url = `https://api.energy-charts.info/price?bzn=FR&start=${startDay}&end=${endDay}`;
    // Retry up to 3 times on 429 (rate limit), backing off 10s then 30s
    const delays = [10000, 30000];
    for (let attempt = 0; ; attempt++) {
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json();
            return { unix: json.unix_seconds || [], price: json.price || [] };
        }
        if (res.status === 429 && attempt < delays.length) {
            console.log(`\n  429 rate-limit, attente ${delays[attempt] / 1000}s...`);
            await sleep(delays[attempt]);
            process.stdout.write(`  retry ${isoDay(new Date(startDay))} → ${isoDay(new Date(endDay))} ... `);
        } else {
            throw new Error(`energy-charts ${res.status} pour ${startDay}..${endDay}`);
        }
    }
}

// Comble les null par report avant borné à 3 créneaux (=1 h) : reconstruit le
// pas 15 min à partir d'un prix day-ahead horaire (constant sur l'heure).
// Les vrais trous (>1 h de null consécutifs) restent null → correctement signalés.
function fillHourlyGaps(prices) {
    let lastVal = null, filled = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] !== null && prices[i] !== undefined) {
            lastVal = prices[i];
            filled = 0;
        } else if (lastVal !== null && filled < 3) {
            prices[i] = lastVal;
            filled++;
        } else {
            lastVal = null; // trou trop long : on arrête de reporter
        }
    }
    return prices;
}

async function main() {
    const now = new Date();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const start = new Date(end);
    start.setUTCFullYear(start.getUTCFullYear() - YEARS);

    // Collecte par tranches de 90 jours (limite l'amplitude par requête)
    const points = new Map(); // unix → prix
    let cursor = new Date(start);
    while (cursor < end) {
        const chunkEnd = new Date(cursor);
        chunkEnd.setUTCDate(chunkEnd.getUTCDate() + 90);
        const e = chunkEnd < end ? chunkEnd : end;
        process.stdout.write(`fetch ${isoDay(cursor)} → ${isoDay(e)} ... `);
        const { unix, price } = await fetchRange(isoDay(cursor), isoDay(e));
        for (let i = 0; i < unix.length; i++) {
            const p = price[i];
            points.set(unix[i], (p === null || p === undefined) ? null : Math.round(p * 100) / 100);
        }
        console.log(`${unix.length} créneaux`);
        cursor = e;
        if (cursor < end) await sleep(2000); // courtoisie envers l'API
    }

    if (points.size === 0) throw new Error('aucune donnée récupérée');

    // Construit la grille continue à partir du premier timestamp
    const keys = [...points.keys()].sort((a, b) => a - b);
    const startUnix = keys[0];
    const lastUnix = keys[keys.length - 1];
    const length = Math.floor((lastUnix - startUnix) / STEP) + 1;
    const prices = new Array(length).fill(null);
    for (const [u, p] of points) {
        const idx = Math.round((u - startUnix) / STEP);
        if (idx >= 0 && idx < length) prices[idx] = p;
    }

    fillHourlyGaps(prices);

    const out = {
        unit: 'EUR/MWh',
        step_seconds: STEP,
        start_unix: startUnix,
        source: 'energy-charts.info (CC BY 4.0, SMARD.de / Bundesnetzagentur)',
        last_update: isoDay(now),
        prices
    };
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, formatSpotFile(out));
    const kb = Math.round(fs.statSync(OUT).size / 1024);
    console.log(`écrit ${OUT} — ${length} créneaux, ${kb} Ko`);
}

// Sérialise en .js lisible : en-tête commenté, métadonnées une par ligne, et
// prix par lignes de 20 valeurs (`null` pour une donnée manquante).
function formatSpotFile(out) {
    const startISO = new Date(out.start_unix * 1000).toISOString();
    const endISO = new Date((out.start_unix + (out.prices.length - 1) * out.step_seconds) * 1000).toISOString();
    const perLine = 20;
    const priceLines = [];
    for (let i = 0; i < out.prices.length; i += perLine) {
        const chunk = out.prices.slice(i, i + perLine).map(v => (v === null ? 'null' : v));
        priceLines.push('        ' + chunk.join(', '));
    }
    return [
        '// Prix spot EPEX FR Day-Ahead — GÉNÉRÉ par tools/update-spot-prices.js (ne pas éditer à la main).',
        '// Grille UTC continue au pas de step_seconds (s) ; prix en EUR/MWh ; null = donnée manquante.',
        `// Période : ${startISO} → ${endISO} (${out.prices.length} créneaux).`,
        'window.spotPrices = {',
        `    "unit": ${JSON.stringify(out.unit)},`,
        `    "step_seconds": ${out.step_seconds},`,
        `    "start_unix": ${out.start_unix},`,
        `    "source": ${JSON.stringify(out.source)},`,
        `    "last_update": ${JSON.stringify(out.last_update)},`,
        '    "prices": [',
        priceLines.join(',\n'),
        '    ]',
        '};',
        ''
    ].join('\n');
}

if (require.main === module) {
    main().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { formatSpotFile };
