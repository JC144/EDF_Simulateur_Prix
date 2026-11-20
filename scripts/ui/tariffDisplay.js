// Sémantique d'affichage des tarifs : traduit les clés brutes du modèle
// (types moteur "rouge", "hcEte", bandes "HP"/"hsc"...) en libellés français
// et couleurs. Présentation pure : aucun import de core/, aucun accès DOM —
// consommé par le renderer et le graphe, testable sous node.
// La structure (quel type est un jour, quelle bande par heure) vient de
// l'abonnement (champ display dérivé par defineTarif) ; ce module ne porte
// que la normalisation des noms et la palette.
// Palette validée (skill dataviz, CVD/contraste sur fond clair) : les couleurs
// sous 3:1 (aqua, ambre) sont toujours accompagnées d'un libellé visible.

const BAND_REGISTRY = {
    hp: { label: "Heures pleines", short: "HP", color: "#eb6834" },
    hc: { label: "Heures creuses", short: "HC", color: "#2a78d6" },
    hsc: { label: "Super creuses", short: "HSC", color: "#1baf7a" },
    happy: { label: "Heures happy", short: "Happy", color: "#4a3aa7" },
    spot: { label: "Prix spot", short: "Spot", color: "#0e7c86" },
    base: { label: "Prix unique", short: "Base", color: "#898781" }
};

// Ordre d'affichage des colonnes/légendes : du plus cher au moins cher,
// puis les bandes spéciales.
const BAND_DISPLAY_ORDER = ["hp", "hc", "hsc", "happy", "spot", "base"];

// Noms de types de jour connus : à prix unique, leur bande se confond avec le
// jour et s'affiche « Prix unique ».
const KNOWN_DAY_KEYS = new Set([
    "bleu", "blanc", "rouge", "base", "weekend", "hiver", "ete",
    "hiverWeekend", "eteWeekend", "sobriete"
]);

const DAY_REGISTRY = {
    bleu: { label: "Bleu", color: "#256abf", ink: "#ffffff" },
    blanc: { label: "Blanc", color: "#f0efec", ink: "#0b0b0b" },
    rouge: { label: "Rouge", color: "#d03b3b", ink: "#ffffff" },
    hiver: { label: "Hiver", color: "#1c5cab", ink: "#ffffff" },
    ete: { label: "Été", color: "#eda100", ink: "#0b0b0b" },
    weekend: { label: "Week-end", color: "#1baf7a", ink: "#0b0b0b" },
    hiverWeekend: { label: "W-E hiver", color: "#1c5cab", ink: "#ffffff" },
    eteWeekend: { label: "W-E été", color: "#eda100", ink: "#0b0b0b" },
    hiverPointe: { label: "Pointe hiver", color: "#a32836", ink: "#ffffff" },
    etePointe: { label: "Pointe été", color: "#a32836", ink: "#ffffff" },
    sobriete: { label: "Sobriété", color: "#4a3aa7", ink: "#ffffff" }
};

const NEUTRAL = { color: "#898781", ink: "#ffffff" };

// "rouge HC" -> { engineType: "rouge", hc: true } — découpe sur le DERNIER
// espace : les noms de types n'en contiennent pas (contrat documenté dans
// scripts/tarifs/README.md).
export function splitHourType(hourType) {
    const cut = hourType.lastIndexOf(" ");
    return {
        engineType: hourType.slice(0, cut),
        hc: hourType.slice(cut + 1) === "HC"
    };
}

// Normalise une clé de bande brute vers un id du registre.
function normalizeBand(key) {
    if (key === "HP") return "hp";
    if (key === "HC") return "hc";
    if (/^hsc/i.test(key) || /sc$/i.test(key)) return "hsc";
    if (/^hp/.test(key)) return "hp";
    if (/^hc/.test(key)) return "hc";
    if (/happy/i.test(key)) return "happy";
    if (KNOWN_DAY_KEYS.has(key)) return "base";
    return key; // clé inconnue : conservée telle quelle (repli neutre)
}

export function bandInfo(bandKey) {
    const id = normalizeBand(bandKey);
    const known = BAND_REGISTRY[id];
    return known
        ? { id: id, label: known.label, short: known.short, color: known.color }
        : { id: id, label: bandKey, short: bandKey, color: NEUTRAL.color };
}

// Badge d'un type de jour : libellé + couleur + couleur de texte.
export function dayBadge(dayKey) {
    if (dayKey === null || dayKey === undefined) {
        return null;
    }
    const known = DAY_REGISTRY[dayKey];
    if (known) {
        return { id: dayKey, label: known.label, color: known.color, ink: known.ink };
    }
    // "hcEte" -> "ete", "hscHiver" -> "hiver" : la clé de saison porte souvent
    // un préfixe de bande.
    const stripped = dayKey.replace(/^(hp|hc|hsc)/, "");
    const key = stripped.charAt(0).toLowerCase() + stripped.slice(1);
    if (key !== dayKey && DAY_REGISTRY[key]) {
        return { id: key, ...DAY_REGISTRY[key] };
    }
    return { id: dayKey, label: dayKey, color: NEUTRAL.color, ink: NEUTRAL.ink };
}

// Colonnes de bandes distinctes d'un tarif, normalisées et ordonnées.
// Un tarif à bande unique (Base) n'affiche pas de colonnes de bande.
export function bandColumns(display) {
    const ids = [];
    for (const key of display.bandOrder) {
        const id = normalizeBand(key);
        if (!ids.includes(id)) {
            ids.push(id);
        }
    }
    ids.sort((a, b) => {
        const ia = BAND_DISPLAY_ORDER.indexOf(a);
        const ib = BAND_DISPLAY_ORDER.indexOf(b);
        return (ia === -1 ? BAND_DISPLAY_ORDER.length : ia) - (ib === -1 ? BAND_DISPLAY_ORDER.length : ib);
    });
    return ids.map(id => bandInfo(id));
}

// Bande normalisée d'un relevé horaire.
export function hourBand(hourType, display) {
    const { engineType, hc } = splitHourType(hourType);
    const type = display.types[engineType];
    const bandKey = type ? type.bands[hc ? "HC" : "HP"] : engineType;
    return bandInfo(bandKey);
}

// Modèle d'affichage d'une journée : badge du jour + agrégats par bande.
// Badge pris au relevé de midi (repli : premier relevé) — les nuits à cheval
// (report de veille) gardent la couleur du jour civil, le graphe horaire
// montre le détail. Jour en erreur (aucun relevé) : ni badge ni bandes.
export function buildDayModel(day, display) {
    const hours = day.hours || [];
    if (hours.length === 0) {
        return { badge: null, byBand: {} };
    }

    let badge = null;
    if (display.dayOrder.length > 0) {
        const noon = hours.find(h => h.time.hour === 12 && h.time.minute === 0) || hours[0];
        const { engineType } = splitHourType(noon.type);
        const type = display.types[engineType];
        badge = type ? dayBadge(type.day) : null;
    }

    const byBand = {};
    for (const hour of hours) {
        const band = hourBand(hour.type, display);
        const sums = byBand[band.id] || (byBand[band.id] = { conso: 0, price: 0 });
        if (!isNaN(hour.conso)) {
            sums.conso += hour.conso;
        }
        if (!isNaN(hour.price)) {
            sums.price += hour.price;
        }
    }
    return { badge: badge, byBand: byBand };
}

// Mélange une couleur #rrggbb vers une valeur de canal cible
// (255 = blanc, 0 = noir ; ratio 0 = inchangée, 1 = cible).
function mixToward(hex, target, ratio) {
    const n = parseInt(hex.slice(1), 16);
    const mix = c => Math.round(c + (target - c) * ratio);
    const rgb = (mix((n >> 16) & 255) << 16) | (mix((n >> 8) & 255) << 8) | mix(n & 255);
    return "#" + rgb.toString(16).padStart(6, "0");
}

function isLight(hex) {
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) > 186;
}

// Décline la couleur du jour par bande : la teinte du jour reste dominante,
// « plus foncé = plus cher » au sein d'une famille de jours. Les jours déjà
// très clairs (Blanc) sont assombris au lieu d'être éclaircis, sinon les
// variantes seraient indiscernables.
function dayBandColor(dayColor, bandId) {
    const rank = BAND_DISPLAY_ORDER.indexOf(bandId);
    if (rank <= 0 || bandId === "base") {
        return dayColor; // HP, prix unique ou bande inconnue : couleur du jour
    }
    const ratio = rank === 1 ? 0.45 : 0.65; // HC, puis super creuses/happy
    return isLight(dayColor) ? mixToward(dayColor, 0, ratio * 0.5) : mixToward(dayColor, 255, ratio);
}

// Pourcentages entiers sommant exactement à 100 (méthode du plus fort reste).
function largestRemainderPercents(values) {
    const total = values.reduce((sum, v) => sum + v, 0);
    const exact = values.map(v => (v * 100) / total);
    const floors = exact.map(Math.floor);
    let rest = 100 - floors.reduce((sum, v) => sum + v, 0);
    const byRemainder = exact
        .map((v, i) => ({ i: i, frac: v - floors[i] }))
        .sort((a, b) => b.frac - a.frac);
    for (let k = 0; k < rest; k++) {
        floors[byRemainder[k].i]++;
    }
    return floors;
}

// Répartition de la consommation (et du coût variable) d'une période par
// tranche horaire — et par jour×tranche (« Bleu HC », « Rouge HP ») pour les
// tarifs à jours colorés.
// Le type de jour est porté par chaque relevé (une journée Tempo mélange la
// nuit bleue reportée et le jour rouge), d'où l'itération sur les hours.
// null si la répartition n'est pas informative : tarif mono-tranche (Base)
// ou moins de deux segments non nuls.
export function buildPeriodShare(months, display) {
    const useDays = display.dayOrder.length > 0;
    if (!useDays && bandColumns(display).length <= 1) {
        return null;
    }

    const sums = new Map();
    for (const month of months) {
        for (const day of month.days) {
            for (const hour of day.hours || []) {
                if (isNaN(hour.conso)) {
                    continue;
                }
                const { engineType } = splitHourType(hour.type);
                const type = display.types[engineType];
                const dayKey = (useDays && type) ? type.day : null;
                const band = hourBand(hour.type, display);
                const key = (dayKey || "") + "|" + band.id;
                // price = part variable seule : l'abonnement est ajouté au
                // niveau jour par le calculateur, pas dans hour.price.
                const price = isNaN(hour.price) ? 0 : hour.price;
                const entry = sums.get(key);
                if (entry) {
                    entry.conso += hour.conso;
                    entry.price += price;
                } else {
                    // Jour à prix unique (EJP...) : la bande porte le nom du
                    // type, le libellé du jour suffit.
                    const singleBand = type && type.bands.HP === type.bands.HC;
                    sums.set(key, { dayKey: dayKey, band: band, singleBand: singleBand, conso: hour.conso, price: price });
                }
            }
        }
    }

    const entries = [...sums.values()].filter(e => e.conso > 0);
    if (entries.length < 2) {
        return null;
    }

    // Ordre des jours : celui du registre (Bleu, Blanc, Rouge...), pas celui de
    // la définition du tarif ; les jours inconnus suivent, dans l'ordre du tarif.
    const dayKeys = Object.keys(DAY_REGISTRY);
    const dayRank = k => {
        if (!k) {
            return dayKeys.length + display.dayOrder.length;
        }
        const i = dayKeys.indexOf(dayBadge(k).id);
        return i !== -1 ? i : dayKeys.length + Math.max(0, display.dayOrder.indexOf(k));
    };
    const bandRank = id => {
        const i = BAND_DISPLAY_ORDER.indexOf(id);
        return i === -1 ? BAND_DISPLAY_ORDER.length : i;
    };
    entries.sort((a, b) =>
        (dayRank(a.dayKey) - dayRank(b.dayKey)) || (bandRank(a.band.id) - bandRank(b.band.id)));

    const total = entries.reduce((sum, e) => sum + e.conso, 0);
    const percents = largestRemainderPercents(entries.map(e => e.conso));
    const totalPrice = entries.reduce((sum, e) => sum + e.price, 0);
    const pricePercents = totalPrice > 0 ? largestRemainderPercents(entries.map(e => e.price)) : null;

    const segments = entries.map((entry, index) => {
        const badge = dayBadge(entry.dayKey);
        let label, longLabel, color;
        if (badge) {
            // La bande n'apporte rien quand elle se confond avec le jour
            // (prix unique type EJP) ; une fenêtre horaire nommée (super
            // creuses d'une saison...) reste affichée.
            const dayOnly = entry.singleBand && !(entry.band.id in BAND_REGISTRY && entry.band.id !== "base");
            label = dayOnly ? badge.label : badge.label + " " + entry.band.short;
            longLabel = dayOnly ? badge.label : badge.label + " — " + entry.band.label;
            color = dayBandColor(badge.color, dayOnly ? "base" : entry.band.id);
        } else {
            label = entry.band.short;
            longLabel = entry.band.label;
            color = entry.band.color;
        }
        return {
            key: (entry.dayKey || "") + "|" + entry.band.id,
            label: label,
            longLabel: longLabel,
            color: color,
            conso: entry.conso,
            pct: percents[index],
            price: entry.price,
            pricePct: pricePercents ? pricePercents[index] : null
        };
    });

    return { total: total, totalPrice: totalPrice, segments: segments };
}
