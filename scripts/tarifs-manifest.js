// Liste ordonnée des scripts classiques de tarifs, chargés à la demande par
// scripts/core/tarifsRegistry.js (au lancement du comparatif, pas sur
// l'accueil : ~440 Ko, ~150 Ko gzip, épargnés au premier affichage).
// L'ordre est celui d'exécution : registre → lib → calendriers → données spot
// → tarifs (socap/soflex exigent SpotPrices["epex-fr"] à leur définition).
// Source unique : les outils Node (tests/helpers/legacyLoader.mjs,
// import/lib/tarif-defs.mjs, import/spot-update.mjs) lisent ce fichier.
// Un chemin par ligne, entre guillemets doubles, relatif à la racine du dépôt.
export const TARIF_SCRIPTS = [
    "scripts/tarifs-registry.js",

    // Bibliothèque de définition déclarative des tarifs (defineTarif, defineCalendar)
    // et calendriers de jours spéciaux partagés — voir scripts/tarifs/README.md
    "scripts/tarifs-lib/define-tarif.js",
    "scripts/tarifs-lib/calendars/tempo-edf.js",
    "scripts/tarifs-lib/calendars/ejp-edf.js",
    "scripts/tarifs-lib/calendars/zenflex-sobriete.js",

    // Prix spot EPEX FR Day-Ahead (energy-charts.info, données SMARD.de,
    // CC BY 4.0), générés par import/spot-update.mjs — avant les tarifs spot (Sobry)
    "scripts/tarifs-lib/spot/epex-fr-2023.js",
    "scripts/tarifs-lib/spot/epex-fr-2024.js",
    "scripts/tarifs-lib/spot/epex-fr-2025.js",
    "scripts/tarifs-lib/spot/epex-fr-2026.js",

    "scripts/tarifs/alpiq/base.js",

    "scripts/tarifs/alterna/baseHC_france.js",
    "scripts/tarifs/alterna/baseHC_local.js",
    "scripts/tarifs/alterna/base_france.js",
    "scripts/tarifs/alterna/base_local.js",
    "scripts/tarifs/alterna/vert_HSC.js",

    "scripts/tarifs/edf/bleu.js",
    "scripts/tarifs/edf/tempo.js",
    "scripts/tarifs/edf/ejp.js",
    "scripts/tarifs/edf/vert.js",
    "scripts/tarifs/edf/vertAuto.js",
    "scripts/tarifs/edf/vertRegional.js",
    "scripts/tarifs/edf/vertWeekEnd.js",
    "scripts/tarifs/edf/zenEstival.js",
    "scripts/tarifs/edf/zenFixe.js",
    "scripts/tarifs/edf/zenOnline.js",
    "scripts/tarifs/edf/zenWeekEnd.js",
    "scripts/tarifs/edf/zenWeekEndPlus.js",

    "scripts/tarifs/enercoop/base.js",
    "scripts/tarifs/enercoop/flexibiliteHC.js",
    "scripts/tarifs/enercoop/flexibiliteHCWE.js",
    "scripts/tarifs/enercoop/flexibiliteSaison.js",

    "scripts/tarifs/engie/electReference3ans.js",

    "scripts/tarifs/labelleenergie/constance.js",
    "scripts/tarifs/labelleenergie/constanceHC.js",
    "scripts/tarifs/labelleenergie/garance.js",
    "scripts/tarifs/labelleenergie/garanceHC.js",
    "scripts/tarifs/labelleenergie/prudence.js",
    "scripts/tarifs/labelleenergie/prudenceHC.js",

    "scripts/tarifs/mint/classicEtGreen.js",
    "scripts/tarifs/mint/classicEtGreenHC.js",
    "scripts/tarifs/mint/onlineEtGreen.js",
    "scripts/tarifs/mint/onlineEtGreenHC.js",

    "scripts/tarifs/sobry/socap.js",
    "scripts/tarifs/sobry/soflex.js",

    "scripts/tarifs/total/chargheures.js",
    "scripts/tarifs/total/heuresEco.js",
    "scripts/tarifs/total/heuresEcoHC.js",
    "scripts/tarifs/total/offreStandardFixe.js",
    "scripts/tarifs/total/offreStandardFixeHC.js",
    "scripts/tarifs/total/offreVerteFixe.js",
    "scripts/tarifs/total/offreVerteFixeHC.js",
];
