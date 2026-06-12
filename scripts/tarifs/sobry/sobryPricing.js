// Tarification Sobry — prix spot indexé (résidentiel ≤ 36 kVA).
// Réf. grille tarifaire Sobry en vigueur au 14 avril 2026.
// Chargé en global navigateur ET exporté pour les tests Node.
(function (global) {
    // Composantes €/kWh HTVA (PDF Sobry p.9, méthode "Comment calculer mon kWh")
    const ACCISE = 0.03085;
    const CEE = 0.007;
    const CAPACITE = 0.003;
    const MARGE = 0.008;
    const TVA = 1.20; // 20 % sur toute la facture (exact 2026)
    const TURPE = { hiver: 0.0632, ete: 0.0149 }; // TURPE variable moyen saisonnier

    const OFFERS = {
        socap: { plafond: { hiver: 0.2167, ete: 0.1125 }, prime: 0.007 },
        soflex: { plafond: { hiver: 0.3333, ete: 0.3333 }, prime: 0.002 }
    };

    // Abonnement TURPE+Sobry, colonne CU4, HTVA €/mois (PDF p.10)
    const ABO_CU4 = [
        { puissance: 3, acheminement: 5.76, total: 9.76 },
        { puissance: 6, acheminement: 8.29, total: 16.29 },
        { puissance: 9, acheminement: 10.82, total: 21.40 },
        { puissance: 12, acheminement: 13.34, total: 25.99 },
        { puissance: 15, acheminement: 15.87, total: 30.29 },
        { puissance: 18, acheminement: 18.40, total: 34.40 },
        { puissance: 24, acheminement: 23.45, total: 42.21 },
        { puissance: 30, acheminement: 28.51, total: 49.67 },
        { puissance: 36, acheminement: 33.56, total: 56.89 }
    ];

    // Mois 1-12 → saison TURPE (hiver = nov→mars, été = avr→oct)
    function seasonOf(month) {
        return (month >= 11 || month <= 3) ? 'hiver' : 'ete';
    }

    // spotEurMwh (€/MWh) → prix TTC en centimes/kWh (unité attendue par le calculateur)
    function computePrixKwhCentimes(spotEurMwh, season, offerKey) {
        if (spotEurMwh === null || spotEurMwh === undefined || isNaN(spotEurMwh)) {
            return NaN;
        }
        const o = OFFERS[offerKey];
        const spot = spotEurMwh / 1000;
        const capped = Math.min(spot + TURPE[season] + ACCISE, o.plafond[season]);
        const htva = capped + CEE + CAPACITE + MARGE + o.prime;
        return htva * TVA * 100;
    }

    // Décalage Europe/Paris (minutes) à l'instant UTC donné (+60 CET ou +120 CEST).
    // Calcul arithmétique de la règle DST UE (pas d'Intl, ~100× plus rapide sur le
    // chemin chaud) : CEST du dernier dimanche de mars 01:00 UTC au dernier dimanche
    // d'octobre 01:00 UTC, CET sinon. Équivalence avec Intl.DateTimeFormat
    // ('Europe/Paris') vérifiée sur tous les créneaux 15 min 2022-2027 (0 écart).
    const _parisDst = {};
    function lastSundayUTC1h(year, monthIndex0) {
        const last = new Date(Date.UTC(year, monthIndex0 + 1, 0)); // dernier jour du mois
        return Date.UTC(year, monthIndex0, last.getUTCDate() - last.getUTCDay(), 1, 0, 0);
    }
    function parisOffsetMinutes(utcMs) {
        const year = new Date(utcMs).getUTCFullYear();
        let b = _parisDst[year];
        if (!b) {
            b = _parisDst[year] = { start: lastSundayUTC1h(year, 2), end: lastSundayUTC1h(year, 9) };
        }
        return (utcMs >= b.start && utcMs < b.end) ? 120 : 60;
    }

    // Heure locale Paris → timestamp unix (secondes).
    // Deux passes : le décalage est recalculé à l'instant ajusté pour rester
    // correct aux bascules DST (ex. 01h–01h59 la nuit du passage à l'heure d'été).
    // En cas d'ambiguïté au retour à l'heure d'hiver, prend l'interprétation CET
    // (seconde occurrence), cohérent avec l'ordre chronologique des relevés Linky.
    function parisLocalToUnix(y, mo, d, h, mi) {
        const guess = Date.UTC(y, mo - 1, d, h, mi);
        const off1 = parisOffsetMinutes(guess);
        const off2 = parisOffsetMinutes(guess - off1 * 60000);
        return Math.floor((guess - off2 * 60000) / 1000);
    }

    // Prix spot moyen (€/MWh) sur le pas de conso, ou null si non couvert
    function spotEurMwhForInterval(spotData, dateStr, time, stepMinutes) {
        const parts = dateStr.split('/').map(Number);
        const startUnix = parisLocalToUnix(parts[0], parts[1], parts[2], time.hour, time.minute);
        const slotMinutes = spotData.step_seconds / 60;
        const n = Math.max(1, Math.round((stepMinutes || slotMinutes) / slotMinutes));
        const startIdx = Math.round((startUnix - spotData.start_unix) / spotData.step_seconds);
        let sum = 0, cnt = 0;
        for (let i = 0; i < n; i++) {
            const idx = startIdx + i;
            if (idx < 0 || idx >= spotData.prices.length) continue;
            const v = spotData.prices[idx];
            if (v === null || v === undefined || Number.isNaN(v)) continue;
            sum += v; cnt++;
        }
        return cnt ? sum / cnt : null;
    }

    // Fabrique le hook getPrixKwh(date, time, dayType, isHC, stepMinutes) attendu
    // par le calculateur. Lit le global spotPrices (chargé depuis data/spot-fr.json).
    function makeGetPrixKwh(offerKey) {
        return function (date, time, dayType, isHC, stepMinutes) {
            const spotData = global.spotPrices;
            if (!spotData || !spotData.prices) return NaN;
            const spot = spotEurMwhForInterval(spotData, date, time, stepMinutes || 60);
            if (spot === null) return NaN;
            const month = Number(date.split('/')[1]);
            return computePrixKwhCentimes(spot, seasonOf(month), offerKey);
        };
    }

    const api = {
        ACCISE, CEE, CAPACITE, MARGE, TVA, TURPE, OFFERS, ABO_CU4,
        seasonOf, computePrixKwhCentimes,
        parisOffsetMinutes, parisLocalToUnix, spotEurMwhForInterval,
        makeGetPrixKwh
    };
    global.sobryPricing = api;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
