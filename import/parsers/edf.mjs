// Grilles EDF (Tarif Bleu, EJP, Zen*, Vert Electrique*) : tableaux « une
// ligne par kVA » découverts par lib/table.mjs, avec une configuration de
// colonnes par PDF. Chaque colonne de prix alimente un ou plusieurs champs
// de dayTypes (chemins "type.HP" / "type.price") ; quand une même valeur
// sert à plusieurs champs (EJP : heures normales = bleu.HP = bleu.HC =
// rouge.HC), la colonne liste tous ses chemins.
// Les prix supérieurs pour certaines puissances (TRV 3/6 kVA) deviennent
// des priceOverrides : la valeur de référence est celle de la plus grande
// puissance.
import path from 'node:path';
import { buildLines, pageToText } from '../lib/pdf-text.mjs';
import { findKvaTables, extractTableValues, buildOffer } from '../lib/table.mjs';
import { findApplicableDate } from '../lib/dates.mjs';

export const provider = 'edf';

export function subscriptionCheck(url) {
    if (path.basename(new URL(url).pathname) !== 'Grille_prix_EJP.pdf') return null;
    return doc => {
        const closed = /option tarifaire EJP est en extinction et n['’]est plus disponible à la souscription/i;
        return closed.test(pageToText(doc.pages[0]))
            ? [{ names: ['EDF - EJP'], kind: 'closed', reason: 'Option EJP en extinction' }] : [];
    };
}

const T = (offer, cols) => ({ offer, cols });

// Une entrée par basename de price_url ; les tableaux dans l'ordre de
// lecture (haut->bas, gauche->droite), colonnes de prix dans l'ordre X
// (après la colonne abonnement, toujours première).
const CONFIGS = {
    'Grille_prix_Tarif_Bleu.pdf': [
        T('EDF - Bleu', [['bleu.price']]),
        T('EDF - Bleu Heures Creuses', [['bleu.HP'], ['bleu.HC']]),
        T('EDF - Tempo', [['bleu.HC'], ['bleu.HP'], ['blanc.HC'], ['blanc.HP'], ['rouge.HC'], ['rouge.HP']]),
    ],
    'Grille_prix_EJP.pdf': [
        T('EDF - EJP', [['bleu.HP', 'bleu.HC', 'rouge.HC'], ['rouge.HP']]),
    ],
    'grille-prix-zen-fixe50.pdf': [
        T('EDF - Zen Fixe 3 ans - Base', [['bleu.price']]),
        T('EDF - Zen Fixe 3 ans - HP/HC', [['bleu.HP'], ['bleu.HC']]),
    ],
    'Grille-prix-zen-fixe.pdf': [
        T('EDF - Zen Fixe', [['bleu.price']]),
        T('EDF - Zen Fixe Heures Creuses', [['bleu.HP'], ['bleu.HC']]),
    ],
    'grille-prix-zen-online.pdf': [
        T('EDF - Zen Online', [['bleu.price']]),
        T('EDF - Zen Online Heures Creuses', [['bleu.HP'], ['bleu.HC']]),
    ],
    'grille-prix-zen-estival.pdf': [
        T('EDF - Zen Estival', [['eteSC.price'], ['ete.HC'], ['ete.HP'], ['hiverSC.price'], ['hiver.HC'], ['hiver.HP']]),
    ],
    'grille-prix-zen-week-end.pdf': [
        T('EDF - Zen Week-End', [['bleu.price'], ['weekend.price']]),
        T('EDF - Zen Week-End HC', [['bleu.HP'], ['bleu.HC'], ['weekend.HP'], ['weekend.HC']]),
        T('EDF - Zen Week-End Option Flex', [['bleu.HC'], ['bleu.HP'], ['sobriete.HC'], ['sobriete.HP']]),
    ],
    // Zen Week-End Plus : colonne « jours fériés » distincte dans le PDF
    // mais non modélisée dans le repo (fusionnée avec le week-end) — le
    // rôle "=chemin" vérifie qu'elle reste bien égale au week-end.
    'grille-prix-zen-week-end-plus.pdf': [
        T('EDF - Zen Week-End Plus', [['bleu.price'], ['weekend.price'], ['=weekend.price']]),
        T('EDF - Zen Week-End Plus HC', [['bleu.HP'], ['bleu.HC'], ['weekend.HP'], ['weekend.HC'], ['=weekend.HP'], ['=weekend.HC']]),
    ],
    'grille-prix-vert-electrique.pdf': [
        T('EDF - Vert Electrique', [['bleu.price']]),
        T('EDF - Vert Electrique Heures Creuses', [['bleu.HP'], ['bleu.HC']]),
    ],
    'grille-prix-vert-electrique-regional.pdf': [
        T('EDF - Vert Electrique Régional', [['bleu.price']]),
        T('EDF - Vert Electrique Régional Heures Creuses', [['bleu.HP'], ['bleu.HC']]),
    ],
    'grille-prix-vert-electrique-auto.pdf': [
        T('EDF - Vert Electrique Auto', [['bleu.HP'], ['bleu.HC']]),
    ],
    'grille-prix-vert-electrique-weekend.pdf': [
        T('EDF - Vert Electrique Week-End', [['bleu.price'], ['weekend.price']]),
        T('EDF - Vert Electrique Week-End Heures Creuses', [['bleu.HP'], ['bleu.HC'], ['weekend.HP'], ['weekend.HC']]),
    ],
};

export function parse(doc, url) {
    const basename = path.basename(new URL(url).pathname);
    const configs = CONFIGS[basename];
    if (!configs) throw new Error(`PDF EDF non configuré : ${basename}`);

    const tables = findKvaTables(doc);
    if (tables.length !== configs.length) {
        throw new Error(`${basename} : ${tables.length} tableau(x) kVA détecté(s), ${configs.length} attendu(s)`);
    }

    const gridDate = findApplicableDate(buildLines(doc.pages[0].items))
        || (doc.pages[1] ? findApplicableDate(buildLines(doc.pages[1].items)) : null);

    const offers = {};
    tables.forEach((table, i) => {
        const config = configs[i];
        // Borne droite : tableau voisin sur la même bande verticale.
        const neighbor = tables
            .filter(t => t.page === table.page && t.kvaX > table.kvaX
                && t.yTop >= table.yBottom && t.yBottom <= table.yTop)
            .sort((a, b) => a.kvaX - b.kvaX)[0];
        const xMax = neighbor ? neighbor.kvaX - 10 : Infinity;

        const rows = extractTableValues(doc, table, xMax, 1 + config.cols.length, `${basename} / ${config.offer}`);
        offers[config.offer] = buildOffer(rows, config.cols);
    });

    return { gridDate, offers };
}

