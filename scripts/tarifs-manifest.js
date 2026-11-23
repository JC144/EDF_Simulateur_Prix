// Liste ordonnée des scripts classiques de tarifs, chargés à la demande par
// scripts/core/tarifsRegistry.js à l'ouverture des résultats, selon les
// offres à comparer.
// L'ordre est celui d'exécution : registre → lib → calendriers → données spot
// → tarifs (SoFlex exige SpotPrices["epex-fr"] à sa définition).
// Source unique : les outils Node (tests/helpers/legacyLoader.mjs,
// import/lib/tarif-defs.mjs, import/spot-update.mjs) lisent ce fichier.
// Un chemin par ligne, entre guillemets doubles, relatif à la racine du dépôt.
export const TARIF_LIBRARIES = [
    "scripts/tarifs-registry.js",
    "scripts/tarifs-lib/define-tarif.js",
];

export const TARIF_CALENDARS = [
    "scripts/tarifs-lib/calendars/tempo-edf.js",
    "scripts/tarifs-lib/calendars/ejp-edf.js",
    "scripts/tarifs-lib/calendars/zenflex-sobriete.js",
    "scripts/tarifs-lib/calendars/enercoop-pointe.js",
    "scripts/tarifs-lib/calendars/total-eclair.js",
];

// Prix spot EPEX FR Day-Ahead (energy-charts.info, données SMARD.de,
// CC BY 4.0), générés par import/spot-update.mjs.
export const TARIF_SPOT_SERIES = [
    "scripts/tarifs-lib/spot/epex-fr-2023.js",
    "scripts/tarifs-lib/spot/epex-fr-2024.js",
    "scripts/tarifs-lib/spot/epex-fr-2025.js",
    "scripts/tarifs-lib/spot/epex-fr-2026.js",
];

export const TARIF_SCRIPTS = [
    ...TARIF_LIBRARIES,
    ...TARIF_CALENDARS,
    ...TARIF_SPOT_SERIES,
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
    "scripts/tarifs/enercoop/flexibiliteSaisonPointe.js",

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

    "scripts/tarifs/octopus/ecoFixeBase.js",
    "scripts/tarifs/octopus/ecoFixeHC.js",
    "scripts/tarifs/octopus/octosaisons.js",

    "scripts/tarifs/sobry/soflex.js",

    "scripts/tarifs/total/chargheures.js",
    "scripts/tarifs/total/heuresEco.js",
    "scripts/tarifs/total/heuresEcoHC.js",
    "scripts/tarifs/total/offreStandardFixe.js",
    "scripts/tarifs/total/offreStandardFixeHC.js",
    "scripts/tarifs/total/offreVerteFixe.js",
    "scripts/tarifs/total/offreVerteFixeHC.js",

    "scripts/tarifs/alpiq/releves.js",
    "scripts/tarifs/alterna/releves.js",
    "scripts/tarifs/dyneff/releves.js",
    "scripts/tarifs/edf/releves.js",
    "scripts/tarifs/engie/releves.js",
    "scripts/tarifs/gedia/releves.js",
    "scripts/tarifs/geg/releves.js",
    "scripts/tarifs/happe/releves.js",
    "scripts/tarifs/ilek/releves.js",
    "scripts/tarifs/labelleenergie/releves.js",
    "scripts/tarifs/octopus/releves.js",
    "scripts/tarifs/papernest/releves.js",
    "scripts/tarifs/plenitude/releves.js",
    "scripts/tarifs/primeo/releves.js",
    "scripts/tarifs/selia/releves.js",
    "scripts/tarifs/total/releves.js",
    "scripts/tarifs/urbansolar/releves.js",
    "scripts/tarifs/total/fixe3Ans.js",
    "scripts/tarifs/mint/smartGreen.js",
    "scripts/tarifs/octopus/go.js",
    "scripts/tarifs/symphonics/heuresCreuses.js",
    "scripts/tarifs/ohm/classique.js",
    "scripts/tarifs/energiedici/energieBleue.js",
    "scripts/tarifs/plenitude/plenifix2Ans.js",
    "scripts/tarifs/total/heuresEcoPlus.js",
    "scripts/tarifs/ohm/extraEco.js",
    "scripts/tarifs/ohm/prixReserve.js",
    "scripts/tarifs/volterres/riverains.js",
    "scripts/tarifs/ilek/voitureElectrique.js",
    "scripts/tarifs/frank/dynamique.js",
    "scripts/tarifs/labelleenergie/regionFiliere.js",
    "scripts/tarifs/mylight150/vertDeFrance.js"
];
