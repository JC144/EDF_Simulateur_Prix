// Bibliothèque de définition déclarative des tarifs.
// Un fichier de tarif appelle defineTarif({...}) avec un objet littéral pur
// (aucune fonction) ; la factory valide la définition, génère l'objet au
// format attendu par le calculateur (voir scripts/core/calculator.js) et le
// pousse dans le registre global `abonnements`.
// Guide contributeur : scripts/tarifs/README.md
(function () {
    "use strict";

    // Calendriers de jours spéciaux partagés entre tarifs (ex. jours Tempo,
    // réutilisables par plusieurs fournisseurs). Voir scripts/tarifs-lib/calendars/.
    window.TarifCalendars = window.TarifCalendars || {};
    // Séries de prix spot partagées entre tarifs (ex. EPEX FR Day-Ahead).
    // Voir scripts/tarifs-lib/spot/ (fichiers générés par import/spot-update.mjs).
    window.SpotPrices = window.SpotPrices || {};
    // Erreurs de définition accumulées (consultables en console et par les tests).
    window.tarifDefinitionErrors = window.tarifDefinitionErrors || [];

    const DATE_FORMAT = /^\d{4}\/\d{2}\/\d{2}$/;
    const TIME_FORMAT = /^(?:(?:[01]?\d|2[0-3]):(?:00|30)|24:00)$/;

    window.defineCalendar = function (name, daysByType) {
        const errors = [];
        if (typeof name !== "string" || name === "") {
            fail(['defineCalendar : nom de calendrier manquant']);
        }
        if (window.TarifCalendars[name]) {
            errors.push(`calendrier "${name}" déjà défini`);
        }
        if (!isPlainObject(daysByType) || Object.keys(daysByType).length === 0) {
            errors.push(`calendrier "${name}" : au moins un type de jour attendu (ex. { rouge: { days: [...] } })`);
        } else {
            for (const [dayType, entry] of Object.entries(daysByType)) {
                if (!isPlainObject(entry) || !Array.isArray(entry.days)) {
                    errors.push(`calendrier "${name}", type "${dayType}" : propriété days manquante (liste de dates "AAAA/MM/JJ")`);
                    continue;
                }
                for (const day of entry.days) {
                    if (typeof day !== "string" || !DATE_FORMAT.test(day)) {
                        errors.push(`calendrier "${name}", type "${dayType}" : date invalide "${day}" (format attendu "AAAA/MM/JJ")`);
                    }
                }
                Object.freeze(entry.days);
            }
        }
        if (errors.length > 0) {
            fail(errors.map(e => `defineCalendar("${name}") : ${e}`));
        }
        window.TarifCalendars[name] = daysByType;
    };

    // Série de prix spot : une source nommée, alimentée de façon cumulative
    // (un fichier par année). Chaque jour porte 24 valeurs (pas horaire) ou
    // 96 (pas quart-horaire) en EUR/MWh — les jours DST sont normalisés à
    // l'import. Prix négatifs autorisés (réalité du marché spot).
    window.defineSpotPrices = function (name, daysByDate) {
        if (typeof name !== "string" || name === "") {
            fail(["defineSpotPrices : nom de source manquant"]);
        }
        const errors = [];
        if (!isPlainObject(daysByDate) || Object.keys(daysByDate).length === 0) {
            errors.push('au moins un jour attendu (ex. { "2023/01/01": [24 valeurs EUR/MWh] })');
        } else {
            const source = window.SpotPrices[name];
            for (const [date, values] of Object.entries(daysByDate)) {
                if (!DATE_FORMAT.test(date)) {
                    errors.push(`date invalide "${date}" (format attendu "AAAA/MM/JJ")`);
                    continue;
                }
                if (source && source.days[date]) {
                    errors.push(`jour "${date}" déjà défini pour cette source`);
                }
                if (!Array.isArray(values) || (values.length !== 24 && values.length !== 96)) {
                    errors.push(`jour "${date}" : 24 ou 96 valeurs attendues, reçu ${Array.isArray(values) ? values.length : typeof values}`);
                    continue;
                }
                if (values.some(v => typeof v !== "number" || !isFinite(v))) {
                    errors.push(`jour "${date}" : valeurs non numériques`);
                    continue;
                }
                Object.freeze(values);
            }
        }
        if (errors.length > 0) {
            fail(errors.map(e => `defineSpotPrices("${name}") : ${e}`));
        }
        const source = window.SpotPrices[name] || (window.SpotPrices[name] = { days: {} });
        Object.assign(source.days, daysByDate);
    };

    // Valide et construit un abonnement SANS l'ajouter au registre : sert aux
    // offres saisies par l'utilisateur (scripts/core/currentOffer.js).
    // options.silent : lève l'erreur sans la consigner dans
    // tarifDefinitionErrors ni dans la console (validation à chaque saisie).
    window.buildTarif = function (def, options) {
        const silent = !!(options && options.silent);
        if (!isPlainObject(def)) {
            fail(["defineTarif : un objet de définition est attendu"], silent);
        }
        const label = typeof def.name === "string" && def.name !== "" ? def.name : "<sans nom>";
        const errors = [];

        validateMetadata(def, errors);
        validateSubscriptions(def, errors);
        if (isPlainObject(def.dayRule) && def.dayRule.type === "spot") {
            // Tarif au prix spot : pas de grille par type de jour, la
            // validation classique (dayTypes/hcRanges) ne s'applique pas.
            validateSpotDef(def, errors);
        } else {
            const pricedTypes = validateDayTypes(def, errors);
            validatePriceOverrides(def, errors);
            validateDayRule(def, pricedTypes, errors);
            validateHcRanges(def, pricedTypes, errors);
        }

        if (errors.length > 0) {
            fail(errors.map(e => `defineTarif("${label}") : ${e}`), silent);
        }

        return buildAbonnement(def);
    };

    window.defineTarif = function (def) {
        const abonnement = window.buildTarif(def);
        abonnements.push(abonnement);
        return abonnement;
    };

    function fail(messages, silent) {
        if (!silent) {
            for (const message of messages) {
                window.tarifDefinitionErrors.push(message);
                console.error(message);
            }
        }
        throw new Error(messages.join("\n"));
    }

    function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    // ------------------------------------------------------------------ //
    //  Validation                                                        //
    // ------------------------------------------------------------------ //

    function validateMetadata(def, errors) {
        if (typeof def.name !== "string" || def.name === "") {
            errors.push('name manquant (ex. "EDF - Tempo")');
        }
        if (typeof def.offer_type !== "string" || def.offer_type === "") {
            errors.push('offer_type manquant ("TRV" ou "Marché")');
        }
        if (typeof def.lastUpdate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(def.lastUpdate)) {
            errors.push('lastUpdate manquant ou invalide (format "AAAA-MM-JJ" : date de la grille de prix)');
        }
        if (typeof def.isCommunity !== "boolean") {
            errors.push("isCommunity manquant (true pour un tarif maintenu par la communauté)");
        }
        if (typeof def.subscription_url !== "string") {
            errors.push("subscription_url manquant (chaîne vide acceptée)");
        }
        if (typeof def.price_url !== "string" || def.price_url === "") {
            errors.push("price_url manquant (lien vers la grille tarifaire officielle)");
        }
    }

    function validateSubscriptions(def, errors) {
        if (!isPlainObject(def.subscriptions) || Object.keys(def.subscriptions).length === 0) {
            errors.push("subscriptions manquant (ex. { 6: 15.65, 9: 19.56 } en €/mois par puissance en kVA)");
            return;
        }
        for (const [kva, price] of Object.entries(def.subscriptions)) {
            if (!/^\d+$/.test(kva)) {
                errors.push(`subscriptions : puissance invalide "${kva}" (entier en kVA attendu)`);
            }
            if (typeof price !== "number" || !isFinite(price) || price <= 0) {
                errors.push(`subscriptions[${kva}] : prix d'abonnement invalide (nombre en €/mois attendu)`);
            }
        }
    }

    // Retourne la liste des types de jour pricés, ou null si invalide.
    function validateDayTypes(def, errors) {
        if (!isPlainObject(def.dayTypes) || Object.keys(def.dayTypes).length === 0) {
            errors.push("dayTypes manquant (ex. { bleu: { HP: 16.12, HC: 13.25 } } en centimes/kWh)");
            return null;
        }
        for (const [name, spec] of Object.entries(def.dayTypes)) {
            validateDayTypeSpec(`dayTypes.${name}`, spec, errors);
        }
        return Object.keys(def.dayTypes);
    }

    function validateDayTypeSpec(path, spec, errors) {
        if (!isPlainObject(spec)) {
            errors.push(`${path} : objet { price } ou { HP, HC } attendu (centimes/kWh)`);
            return false;
        }
        const keys = Object.keys(spec).sort().join(",");
        if (keys !== "price" && keys !== "HC,HP") {
            errors.push(`${path} : clés attendues { price } ou { HP, HC }, reçu { ${Object.keys(spec).join(", ")} }`);
            return false;
        }
        for (const [key, value] of Object.entries(spec)) {
            if (typeof value !== "number" || !isFinite(value) || value <= 0) {
                errors.push(`${path}.${key} : prix invalide (nombre en centimes/kWh attendu)`);
                return false;
            }
        }
        return true;
    }

    function validatePriceOverrides(def, errors) {
        if (def.priceOverrides === undefined) {
            return;
        }
        if (!isPlainObject(def.priceOverrides)) {
            errors.push("priceOverrides : objet { <kVA>: { <type>: { price } } } attendu");
            return;
        }
        for (const [kva, overrides] of Object.entries(def.priceOverrides)) {
            if (!isPlainObject(def.subscriptions) || !(kva in def.subscriptions)) {
                errors.push(`priceOverrides[${kva}] : puissance absente de subscriptions`);
            }
            if (!isPlainObject(overrides)) {
                errors.push(`priceOverrides[${kva}] : objet { <type>: { price } } attendu`);
                continue;
            }
            for (const [type, spec] of Object.entries(overrides)) {
                if (!isPlainObject(def.dayTypes) || !(type in def.dayTypes)) {
                    errors.push(`priceOverrides[${kva}].${type} : type de jour absent de dayTypes`);
                }
                validateDayTypeSpec(`priceOverrides[${kva}].${type}`, spec, errors);
            }
        }
    }

    // Tarif au prix spot : dayRule = { type: "spot", source } et spotFormula
    // porte les composantes de la formule (en centimes/kWh hors TVA, sauf tva
    // qui est un multiplicateur). Prix du kWh par créneau :
    //   (min(spot + turpe[saison] + accise, cap[saison])
    //    + conformite + marge + prime) * tva
    // Saisons TURPE : hiver = novembre à mars, été = avril à octobre.
    const SPOT_FORMULA_KEYS = ["turpe", "accise", "cap", "conformite", "marge", "prime", "tva"];
    const SPOT_SEASON_KEYS = ["hiver", "ete"];

    function validateSpotDef(def, errors) {
        const rule = def.dayRule;
        const ruleKeys = Object.keys(rule).sort().join(",");
        if (ruleKeys !== "source,type") {
            errors.push('dayRule : clés attendues { type: "spot", source }, reçu { ' + Object.keys(rule).join(", ") + " }");
        } else if (typeof rule.source !== "string" || !window.SpotPrices[rule.source]) {
            errors.push(`dayRule.source : source de prix spot inconnue "${rule.source}" (le script de données spot doit être chargé avant le tarif dans index.html)`);
        }
        for (const forbidden of ["dayTypes", "hcRanges", "priceOverrides"]) {
            if (def[forbidden] !== undefined) {
                errors.push(`${forbidden} : à omettre avec dayRule.type "spot" (le prix du kWh vient de spotFormula)`);
            }
        }
        const formula = def.spotFormula;
        if (!isPlainObject(formula)) {
            errors.push("spotFormula manquant (composantes de la formule spot en centimes/kWh, voir scripts/tarifs/README.md)");
            return;
        }
        for (const key of Object.keys(formula)) {
            if (!SPOT_FORMULA_KEYS.includes(key)) {
                errors.push(`spotFormula.${key} : clé inconnue (clés attendues : ${SPOT_FORMULA_KEYS.join(", ")})`);
            }
        }
        for (const key of ["turpe", "cap"]) {
            const value = formula[key];
            if (!isPlainObject(value) || Object.keys(value).sort().join(",") !== "ete,hiver" ||
                SPOT_SEASON_KEYS.some(s => typeof value[s] !== "number" || !isFinite(value[s]) || value[s] < 0)) {
                errors.push(`spotFormula.${key} : objet { hiver, ete } attendu (centimes/kWh)`);
            }
        }
        for (const key of ["accise", "conformite", "marge", "prime"]) {
            const value = formula[key];
            if (typeof value !== "number" || !isFinite(value) || value < 0) {
                errors.push(`spotFormula.${key} : nombre positif attendu (centimes/kWh)`);
            }
        }
        if (typeof formula.tva !== "number" || !isFinite(formula.tva) || formula.tva < 1) {
            errors.push("spotFormula.tva : multiplicateur attendu (ex. 1.20 pour une TVA à 20 %)");
        }
    }

    function validateDayRule(def, pricedTypes, errors) {
        const rule = def.dayRule;
        if (!isPlainObject(rule) || typeof rule.type !== "string") {
            errors.push('dayRule manquant (ex. { type: "constant", dayType: "bleu" })');
            return;
        }
        if (!(rule.type in RULE_BUILDERS)) {
            errors.push(`dayRule.type inconnu "${rule.type}" (types supportés : ${Object.keys(RULE_BUILDERS).join(", ")})`);
            return;
        }
        if (pricedTypes === null) {
            return; // dayTypes invalide : inutile de vérifier les références
        }

        const priced = new Set(pricedTypes);
        const referenced = new Set();
        const requireType = (path, type) => {
            if (typeof type !== "string" || !priced.has(type)) {
                errors.push(`${path} : type de jour "${type}" absent de dayTypes`);
            } else {
                referenced.add(type);
            }
        };

        if (rule.previousDayBefore !== undefined &&
            (!Number.isInteger(rule.previousDayBefore) || rule.previousDayBefore < 0 || rule.previousDayBefore > 24)) {
            errors.push("dayRule.previousDayBefore : heure entière entre 0 et 24 attendue");
        }

        switch (rule.type) {
            case "constant":
                requireType("dayRule.dayType", rule.dayType);
                if (rule.hourSubTypes !== undefined) {
                    validateHourSubRuleList("dayRule.hourSubTypes", rule.hourSubTypes, requireType, errors);
                }
                if (rule.previousDayBefore !== undefined) {
                    errors.push('dayRule.previousDayBefore : sans effet avec type "constant"');
                }
                break;

            case "weekly": {
                requireType("dayRule.default", rule.default);
                if (!isPlainObject(rule.days) || Object.keys(rule.days).length !== 1) {
                    errors.push('dayRule.days : exactement un type attendu (ex. { weekend: [0, 6] } — 0 = dimanche, 6 = samedi)');
                    break;
                }
                const [type, days] = Object.entries(rule.days)[0];
                requireType("dayRule.days", type);
                if (!Array.isArray(days) || days.length === 0 ||
                    days.some(d => !Number.isInteger(d) || d < 0 || d > 6)) {
                    errors.push(`dayRule.days.${type} : liste de jours de semaine attendue (0 = dimanche ... 6 = samedi)`);
                }
                if (rule.userDaySetting !== undefined && rule.userDaySetting !== "jourZenPlus") {
                    errors.push('dayRule.userDaySetting : seul "jourZenPlus" est supporté');
                }
                if (rule.previousDayBefore !== undefined) {
                    errors.push('dayRule.previousDayBefore : sans effet avec type "weekly"');
                }
                break;
            }

            case "calendar": {
                requireType("dayRule.default", rule.default);
                const calendar = window.TarifCalendars[rule.calendar];
                if (!calendar) {
                    errors.push(`dayRule.calendar : calendrier inconnu "${rule.calendar}" (le script du calendrier doit être chargé avant le tarif dans index.html)`);
                    break;
                }
                for (const type of Object.keys(calendar)) {
                    requireType(`dayRule.calendar "${rule.calendar}"`, type);
                }
                break;
            }

            case "season": {
                if (!isPlainObject(rule.seasons) || Object.keys(rule.seasons).length === 0) {
                    errors.push('dayRule.seasons manquant (ex. { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } })');
                    break;
                }
                const coveredMonths = new Set();
                let hasWeekendType = false;
                for (const [season, spec] of Object.entries(rule.seasons)) {
                    requireType(`dayRule.seasons.${season}`, season);
                    if (!isPlainObject(spec) || !Array.isArray(spec.months) || spec.months.length === 0) {
                        errors.push(`dayRule.seasons.${season}.months : liste de mois attendue (1 à 12)`);
                        continue;
                    }
                    for (const month of spec.months) {
                        if (!Number.isInteger(month) || month < 1 || month > 12) {
                            errors.push(`dayRule.seasons.${season}.months : mois invalide "${month}"`);
                        } else if (coveredMonths.has(month)) {
                            errors.push(`dayRule.seasons : mois ${month} présent dans plusieurs saisons`);
                        } else {
                            coveredMonths.add(month);
                        }
                    }
                    if (spec.weekendType !== undefined) {
                        hasWeekendType = true;
                        requireType(`dayRule.seasons.${season}.weekendType`, spec.weekendType);
                    }
                }
                for (let month = 1; month <= 12; month++) {
                    if (!coveredMonths.has(month)) {
                        errors.push(`dayRule.seasons : mois ${month} couvert par aucune saison`);
                    }
                }
                if (hasWeekendType) {
                    if (!Array.isArray(rule.weekendDays) || rule.weekendDays.length === 0 ||
                        rule.weekendDays.some(d => !Number.isInteger(d) || d < 0 || d > 6)) {
                        errors.push("dayRule.weekendDays : liste de jours de semaine attendue (0 = dimanche ... 6 = samedi) quand weekendType est utilisé");
                    }
                    if (rule.hourSubTypes !== undefined) {
                        errors.push("dayRule.hourSubTypes : non supporté en même temps que weekendType (précédence non définie)");
                    }
                } else if (rule.weekendDays !== undefined) {
                    errors.push("dayRule.weekendDays : sans effet sans weekendType dans les saisons");
                }
                if (rule.hourSubTypes !== undefined && !hasWeekendType) {
                    if (!isPlainObject(rule.hourSubTypes)) {
                        errors.push("dayRule.hourSubTypes : objet { <saison>: [{ fromHour, toHour, dayType }] } attendu");
                    } else {
                        for (const [season, subRules] of Object.entries(rule.hourSubTypes)) {
                            if (!isPlainObject(rule.seasons) || !(season in rule.seasons)) {
                                errors.push(`dayRule.hourSubTypes.${season} : saison absente de dayRule.seasons`);
                            }
                            validateHourSubRuleList(`dayRule.hourSubTypes.${season}`, subRules, requireType, errors);
                        }
                    }
                }
                if (rule.calendarOverride !== undefined) {
                    if (hasWeekendType) {
                        errors.push("dayRule.calendarOverride : non supporté en même temps que weekendType (précédence non définie)");
                    }
                    if (rule.hourSubTypes !== undefined) {
                        errors.push("dayRule.calendarOverride : non supporté en même temps que hourSubTypes (précédence non définie)");
                    }
                    if (!isPlainObject(rule.calendarOverride) || typeof rule.calendarOverride.calendar !== "string" ||
                        !Array.isArray(rule.calendarOverride.types) || rule.calendarOverride.types.length === 0) {
                        errors.push('dayRule.calendarOverride : objet { calendar: "tempo-edf", types: ["rouge"] } attendu');
                        break;
                    }
                    const calendar = window.TarifCalendars[rule.calendarOverride.calendar];
                    if (!calendar) {
                        errors.push(`dayRule.calendarOverride.calendar : calendrier inconnu "${rule.calendarOverride.calendar}" (le script du calendrier doit être chargé avant le tarif dans index.html)`);
                        break;
                    }
                    for (const type of rule.calendarOverride.types) {
                        if (!(type in calendar)) {
                            errors.push(`dayRule.calendarOverride.types : type "${type}" absent du calendrier "${rule.calendarOverride.calendar}"`);
                        } else {
                            requireType("dayRule.calendarOverride.types", type);
                        }
                    }
                }
                break;
            }
        }

        // Un type pricé mais jamais atteignable est presque toujours une faute de frappe.
        if (errors.length === 0) {
            for (const type of priced) {
                if (!referenced.has(type)) {
                    errors.push(`dayTypes.${type} : type pricé mais jamais utilisé par dayRule`);
                }
            }
        }
    }

    // Sous-règles horaires ({ fromHour, toHour, dayType }) partagées entre les
    // règles "constant" (liste plate) et "season" (une liste par saison).
    function validateHourSubRuleList(path, subRules, requireType, errors) {
        if (!Array.isArray(subRules)) {
            errors.push(`${path} : liste de règles attendue`);
            return;
        }
        for (const subRule of subRules) {
            if (!isPlainObject(subRule) ||
                !Number.isInteger(subRule.fromHour) || !Number.isInteger(subRule.toHour) ||
                subRule.fromHour < 0 || subRule.toHour > 24 || subRule.fromHour >= subRule.toHour) {
                errors.push(`${path} : règle invalide ({ fromHour, toHour, dayType } avec fromHour < toHour attendu)`);
                continue;
            }
            requireType(path, subRule.dayType);
        }
    }

    function validateHcRanges(def, pricedTypes, errors) {
        const allSinglePrice = isPlainObject(def.dayTypes) &&
            Object.values(def.dayTypes).every(spec => isPlainObject(spec) && "price" in spec);

        if (allSinglePrice) {
            if (def.hcRanges !== undefined) {
                errors.push("hcRanges : à omettre quand tous les dayTypes utilisent { price } (prix unique)");
            }
            return;
        }
        if (def.hcRanges === undefined) {
            errors.push('hcRanges manquant ("custom", liste de plages [{ from, to }] ou { byDayType })');
            return;
        }
        if (def.hcRanges === "custom") {
            return;
        }
        if (Array.isArray(def.hcRanges)) {
            validateRangeList("hcRanges", def.hcRanges, errors);
            return;
        }
        if (isPlainObject(def.hcRanges) && isPlainObject(def.hcRanges.byDayType)) {
            const covered = Object.keys(def.hcRanges.byDayType);
            for (const [type, ranges] of Object.entries(def.hcRanges.byDayType)) {
                if (pricedTypes !== null && !pricedTypes.includes(type)) {
                    errors.push(`hcRanges.byDayType.${type} : type de jour absent de dayTypes`);
                }
                validateRangeList(`hcRanges.byDayType.${type}`, ranges, errors);
            }
            if (pricedTypes !== null) {
                for (const type of pricedTypes) {
                    if (!covered.includes(type)) {
                        errors.push(`hcRanges.byDayType : plages manquantes pour le type "${type}" (liste vide [] pour "aucune heure creuse")`);
                    }
                }
            }
            return;
        }
        errors.push('hcRanges invalide : "custom", liste de plages [{ from: "22:00", to: "24:00" }] ou { byDayType: {...} } attendu');
    }

    function validateRangeList(path, ranges, errors) {
        if (!Array.isArray(ranges)) {
            errors.push(`${path} : liste de plages attendue`);
            return;
        }
        for (const range of ranges) {
            if (!isPlainObject(range) ||
                typeof range.from !== "string" || !TIME_FORMAT.test(range.from) ||
                typeof range.to !== "string" || !TIME_FORMAT.test(range.to)) {
                errors.push(`${path} : plage invalide (format { from: "HH:MM", to: "HH:MM" }, minutes 00 ou 30, minuit en fin de plage = "24:00")`);
                continue;
            }
            if (range.from === range.to) {
                errors.push(`${path} : plage vide ${range.from} -> ${range.to}`);
            }
        }
    }

    // ------------------------------------------------------------------ //
    //  Construction de l'objet au format legacy du calculateur           //
    // ------------------------------------------------------------------ //

    function buildAbonnement(def) {
        const rule = RULE_BUILDERS[def.dayRule.type](def.dayRule, def);
        const hcParts = buildHc(def);

        const abonnement = {
            name: def.name,
            offer_type: def.offer_type,
            lastUpdate: def.lastUpdate,
            isCommunity: def.isCommunity,
            subscription_url: def.subscription_url,
            price_url: def.price_url,
            prices: buildPrices(def),
            hc: hcParts.hc,
            hasHCCustom: hcParts.hasHCCustom,
            hasSpecialDaysCustom: rule.hasSpecialDaysCustom,
            specialDays: rule.specialDays,
            display: buildDisplay(def),
            getDayType: rule.getDayType
        };
        if (hcParts.hcByDayType) {
            abonnement.hcByDayType = hcParts.hcByDayType;
        }
        if (rule.spotPricesFor) {
            abonnement.spotPricesFor = rule.spotPricesFor;
        }
        return abonnement;
    }

    // Table de présentation dérivée mécaniquement de la définition : pour
    // chaque type moteur, la clé de JOUR (badge affiché, null si le tarif n'a
    // qu'un jour possible) et la clé de BANDE horaire par classement HP/HC.
    // Les clés restent brutes (ex. "hscHiver") : libellés et couleurs sont
    // résolus côté UI (scripts/ui/tariffDisplay.js).
    function buildDisplay(def) {
        const rule = def.dayRule;
        const dayOf = {};      // type "jour" -> sa clé de jour
        const subTypeDay = {}; // sous-type horaire -> clé du jour porteur
        const dayKeys = [];

        // Prix spot : un seul type moteur "spot", pas de badge de jour, une
        // seule bande (comme les tarifs Base à prix unique).
        if (rule.type === "spot") {
            return {
                types: { spot: { day: null, bands: { HP: "spot", HC: "spot" } } },
                dayOrder: [],
                bandOrder: ["spot"]
            };
        }

        switch (rule.type) {
            case "constant":
                dayOf[rule.dayType] = null;
                for (const sub of rule.hourSubTypes || []) {
                    subTypeDay[sub.dayType] = null;
                }
                break;

            case "weekly": {
                dayOf[rule.default] = rule.default;
                dayKeys.push(rule.default);
                const special = Object.keys(rule.days)[0];
                dayOf[special] = special;
                dayKeys.push(special);
                break;
            }

            case "calendar":
                dayOf[rule.default] = rule.default;
                dayKeys.push(rule.default);
                for (const type of Object.keys(window.TarifCalendars[rule.calendar])) {
                    dayOf[type] = type;
                    dayKeys.push(type);
                }
                break;

            case "season":
                for (const [season, spec] of Object.entries(rule.seasons)) {
                    dayOf[season] = season;
                    dayKeys.push(season);
                    if (spec.weekendType !== undefined) {
                        dayOf[spec.weekendType] = spec.weekendType;
                        dayKeys.push(spec.weekendType);
                    }
                }
                for (const [season, subRules] of Object.entries(rule.hourSubTypes || {})) {
                    for (const sub of subRules) {
                        subTypeDay[sub.dayType] = season;
                    }
                }
                if (rule.calendarOverride) {
                    for (const type of rule.calendarOverride.types) {
                        dayOf[type] = type;
                        dayKeys.push(type);
                    }
                }
                break;
        }

        const types = {};
        const bandOrder = [];
        const addBand = key => {
            if (!bandOrder.includes(key)) {
                bandOrder.push(key);
            }
        };
        for (const [name, spec] of Object.entries(def.dayTypes)) {
            const isSubType = name in subTypeDay;
            const day = isSubType ? subTypeDay[name] : (name in dayOf ? dayOf[name] : null);
            let bands;
            if (!isSubType && "HP" in spec) {
                bands = { HP: "HP", HC: "HC" };
                addBand("HP");
                addBand("HC");
            } else {
                // Prix unique ou fenêtre horaire : une seule bande, nommée
                // comme le type (la distinction HP/HC n'a pas de sens affiché).
                bands = { HP: name, HC: name };
                addBand(name);
            }
            types[name] = { day: day, bands: bands };
        }

        const distinctDays = [...new Set(dayKeys)];
        return {
            types: types,
            dayOrder: distinctDays.length > 1 ? distinctDays : [],
            bandOrder: bandOrder
        };
    }

    function buildPrices(def) {
        return Object.entries(def.subscriptions).map(([kva, abonnement]) => {
            const entry = { puissance: Number(kva), abonnement: abonnement };
            // Tarif spot : pas de grille par type de jour, le prix du kWh est
            // fourni par créneau via spotPricesFor.
            for (const [type, spec] of Object.entries(def.dayTypes || {})) {
                const override = def.priceOverrides && def.priceOverrides[kva] && def.priceOverrides[kva][type];
                entry[type] = toPrixKwh(override || spec);
            }
            return entry;
        });
    }

    function toPrixKwh(spec) {
        if ("price" in spec) {
            return { prixKwhHC: spec.price };
        }
        return { prixKwhHP: spec.HP, prixKwhHC: spec.HC };
    }

    function buildHc(def) {
        // Prix unique : tout est compté en HC via une plage couvrant la journée.
        if (def.hcRanges === undefined) {
            return { hc: [fullDayRange()], hasHCCustom: false };
        }
        if (def.hcRanges === "custom") {
            return { hc: [], hasHCCustom: true };
        }
        if (Array.isArray(def.hcRanges)) {
            return { hc: def.hcRanges.map(toLegacyRange), hasHCCustom: false };
        }
        const hcByDayType = {};
        for (const [type, ranges] of Object.entries(def.hcRanges.byDayType)) {
            hcByDayType[type] = ranges.map(toLegacyRange);
        }
        return { hc: [], hasHCCustom: false, hcByDayType: hcByDayType };
    }

    function fullDayRange() {
        return { start: { hour: 0, minute: 0 }, end: { hour: 24, minute: 0 } };
    }

    function toLegacyRange(range) {
        const [fromHour, fromMinute] = range.from.split(":").map(Number);
        const [toHour, toMinute] = range.to.split(":").map(Number);
        return {
            start: { hour: fromHour, minute: fromMinute },
            end: { hour: toHour, minute: toMinute }
        };
    }

    // Heure scalaire d'un relevé pour les sous-règles horaires : même
    // convention que le classement HP/HC du calculateur (le relevé étiqueté T
    // couvre ]T - pas ; T]) — minuit vaut 24, les demi-heures comptent 0,5.
    // Une fenêtre { fromHour, toHour } couvre donc les relevés ]fromHour ; toHour].
    function subTypeHourOf(time) {
        const hour = time.hour === 24 ? 0 : time.hour;
        if (hour === 0 && time.minute === 0) {
            return 24;
        }
        return hour + (time.minute === 30 ? 0.5 : 0);
    }

    function inSubRule(time, subRule) {
        const hour = subTypeHourOf(time);
        return hour > subRule.fromHour && hour <= subRule.toHour;
    }

    // Chaque builder retourne { specialDays, hasSpecialDaysCustom, getDayType }.
    // Les getDayType générés reproduisent exactement la sémantique des anciens
    // fichiers de tarifs (y compris la règle "avant Nh = couleur de la veille").
    const RULE_BUILDERS = {
        constant: function (rule) {
            const dayType = rule.dayType;
            const subRules = rule.hourSubTypes;
            if (!subRules) {
                return {
                    specialDays: [],
                    hasSpecialDaysCustom: false,
                    getDayType: function () {
                        return dayType;
                    }
                };
            }
            return {
                specialDays: [],
                hasSpecialDaysCustom: false,
                getDayType: function (day, time) {
                    for (const subRule of subRules) {
                        if (inSubRule(time, subRule)) {
                            return subRule.dayType;
                        }
                    }
                    return dayType;
                }
            };
        },

        weekly: function (rule) {
            const defaultType = rule.default;
            const specialType = Object.keys(rule.days)[0];
            return {
                // Tableau de numéros de jours : la personnalisation utilisateur
                // (jourZenPlus) est poussée dedans par simulation.js.
                specialDays: rule.days[specialType].slice(),
                hasSpecialDaysCustom: rule.userDaySetting !== undefined,
                getDayType: function (day) {
                    const dayOfWeek = new Date(day.date).getDay();
                    return this.specialDays.includes(dayOfWeek) ? specialType : defaultType;
                }
            };
        },

        calendar: function (rule) {
            const defaultType = rule.default;
            const previousDayBefore = rule.previousDayBefore;
            const calendar = window.TarifCalendars[rule.calendar];
            const specialDays = Object.entries(calendar).map(([name, entry]) => ({
                name: name,
                numberOfDays: entry.numberOfDays,
                monthBegin: entry.monthBegin,
                monthEnd: entry.monthEnd,
                lastDays: entry.days
            }));
            return {
                specialDays: specialDays,
                hasSpecialDaysCustom: false,
                getDayType: function (day, time) {
                    let dayType = defaultType;
                    let date = day.date;
                    if (previousDayBefore !== undefined && time.hour < previousDayBefore) {
                        // La couleur est celle de la veille (nuit à cheval sur deux jours).
                        let dateObj = new Date(day.date + " 12:00:00");
                        dateObj.setDate(dateObj.getDate() - 1);
                        date = dateObj.toISOString().split("T")[0].replace(/-/g, "/");
                    }
                    this.specialDays.forEach(function (specialDay) {
                        if (specialDay.lastDays.includes(date)) {
                            dayType = specialDay.name;
                        }
                    });
                    return dayType;
                }
            };
        },

        season: function (rule) {
            const previousDayBefore = rule.previousDayBefore;
            const monthToSeason = {};
            const weekendTypeBySeason = {};
            for (const [season, spec] of Object.entries(rule.seasons)) {
                for (const month of spec.months) {
                    monthToSeason[month] = season;
                }
                if (spec.weekendType !== undefined) {
                    weekendTypeBySeason[season] = spec.weekendType;
                }
            }
            const weekendDays = rule.weekendDays || [];
            const hourSubTypes = rule.hourSubTypes || {};
            // Jours de calendrier prioritaires sur la saison (ex. jours rouges
            // Tempo par-dessus hiver/été pour OctoTempo).
            const calendarOverrides = rule.calendarOverride
                ? rule.calendarOverride.types.map(type => ({
                    type: type,
                    days: window.TarifCalendars[rule.calendarOverride.calendar][type].days
                }))
                : [];
            return {
                specialDays: [],
                hasSpecialDaysCustom: false,
                getDayType: function (day, time) {
                    let checkDate = day.date;
                    if (previousDayBefore !== undefined && time.hour < previousDayBefore) {
                        let dateObj = new Date(day.date + " 12:00:00");
                        dateObj.setDate(dateObj.getDate() - 1);
                        checkDate = dateObj.toISOString().split("T")[0].replace(/-/g, "/");
                    }
                    // La date décalée sert aussi aux jours de calendrier (une nuit
                    // de jour rouge avant Nh reste rouge).
                    for (const override of calendarOverrides) {
                        if (override.days.includes(checkDate)) {
                            return override.type;
                        }
                    }
                    const month = Number(checkDate.split("/")[1]);
                    const season = monthToSeason[month];
                    // Le week-end est évalué sur la même date décalée que la saison
                    // (une nuit de dimanche avant Nh compte comme du week-end).
                    if (weekendTypeBySeason[season] !== undefined) {
                        const dayOfWeek = new Date(checkDate + " 12:00:00").getDay();
                        if (weekendDays.includes(dayOfWeek)) {
                            return weekendTypeBySeason[season];
                        }
                    }
                    // Les sous-types horaires (super creuses) utilisent l'heure du
                    // jour même, sans report de veille — comportement historique.
                    const subRules = hourSubTypes[season];
                    if (subRules) {
                        for (const subRule of subRules) {
                            if (inSubRule(time, subRule)) {
                                return subRule.dayType;
                            }
                        }
                    }
                    return season;
                }
            };
        },

        // Tarif au prix spot : le type de jour est constant ("spot"), le prix
        // du kWh est dérivé de la série de prix par spotPricesFor(date) —
        // consommée par le calculateur à la place de la grille.
        spot: function (rule, def) {
            const source = window.SpotPrices[rule.source];
            const formula = def.spotFormula;
            // Saisons TURPE standard : hiver = novembre à mars.
            const WINTER_MONTHS = [11, 12, 1, 2, 3];
            // Mémoïsation par date : les données et la formule sont figées,
            // la copie superficielle de simulation.js partage la closure.
            const cache = new Map();
            return {
                specialDays: [],
                hasSpecialDaysCustom: false,
                getDayType: function () {
                    return "spot";
                },
                // -> tableau de prix en centimes TTC/kWh (un par pas spot du
                // jour : 24 ou 96 valeurs), ou null si la date est absente.
                spotPricesFor: function (date) {
                    if (cache.has(date)) {
                        return cache.get(date);
                    }
                    const eurMwh = source.days[date];
                    let prices = null;
                    if (eurMwh) {
                        const month = Number(date.split("/")[1]);
                        const season = WINTER_MONTHS.includes(month) ? "hiver" : "ete";
                        const turpe = formula.turpe[season];
                        const cap = formula.cap[season];
                        // 1 EUR/MWh = 0,1 centime/kWh ; le plafond s'applique
                        // par créneau sur (spot + TURPE + accise) seulement.
                        prices = eurMwh.map(v =>
                            (Math.min(v / 10 + turpe + formula.accise, cap)
                                + formula.conformite + formula.marge + formula.prime) * formula.tva);
                    }
                    cache.set(date, prices);
                    return prices;
                }
            };
        }
    };
})();
