# Tests

Suite de tests de non-régression des tarifs et du calcul, sans aucune dépendance npm.

## Prérequis

- **Node.js ≥ 22.7** (runner `node:test` natif + détection automatique des modules ES).
- Le CSV d'échantillon `Sample/mes-puissances-atteintes-30min-000000000000-00000.csv`
  (structure d'un export EDF réel — encodage Latin-1, pas de 30 min, 727 jours de
  2024/02/01 à 2026/01/30, jours incomplets compris — avec des valeurs de
  consommation synthétiques anonymisées).

## Lancer les tests

```powershell
node --test "tests/**/*.test.mjs"
```

(Le glob est interprété par Node lui-même : la commande est identique sous bash.)

## Structure

- `unit/` — tests unitaires ciblés : frontières HP/HC du calculateur, plages HC
  personnalisées, parser CSV EDF, règles `getDayType` (Tempo, EJP, week-end, Estival),
  slugs des pages de grille et péremption à 6 mois (`tarifMeta.test.mjs`). Le
  contenu des pages `tarifs/*.html` est testé côté `import/` (`npm test`).
- `golden.test.mjs` + `golden/` — tests golden-master : les résultats complets de la
  simulation sur le CSV réel sont figés dans des snapshots JSON versionnés.
  - `monthly-<kva>.json` — agrégats mensuels (conso, prix, HP/HC) par tarif EDF, pour
    chaque puissance souscrite.
  - `daily-9kva.json` — détail journalier sur décembre 2024 / janvier 2025 (fenêtre
    traversant jours Tempo rouges/blancs, week-ends et frontières de mois).
  - `daytypes-edf.json` — type de jour retourné par chaque tarif EDF à 3h, 12h et 23h
    pour chaque date du CSV (fige la règle « avant 6h = couleur de la veille »).
  - `contracts-edf.json` — champs statiques de chaque abonnement EDF (grilles de prix,
    plages HC, flags, calendriers de jours spéciaux).
- `helpers/` — chargement des scripts de tarifs dans un contexte `node:vm` frais
  (la liste des fichiers vient d'`index.html`), lecture Latin-1 du CSV, helpers golden.

## Régénérer les goldens

À ne faire **que** pour un changement de comportement volontaire (mise à jour de prix,
nouvelles dates Tempo, nouveau tarif…), jamais pendant un refactoring iso-comportement :

```powershell
$env:UPDATE_GOLDEN = '1'; node --test "tests/**/*.test.mjs"; Remove-Item Env:UPDATE_GOLDEN
```

```bash
UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"
```

Relire ensuite le diff git des fichiers `tests/golden/*.json` : il doit correspondre
exactement au changement voulu.

## Notes

- Les goldens ont été générés avec le fuseau `Europe/Paris`. Les règles de jour
  utilisent `new Date("YYYY/MM/DD")` (fuseau local) : une future CI devra forcer
  `TZ=Europe/Paris`.
- Certains comportements historiques sont volontairement figés par les tests :
  accumulation de `specialDays` entre deux simulations, absence de règle « veille »
  sur EJP et Zen Week-End Option Flex, plage HC `00:00 → 00:00` rejetée.
