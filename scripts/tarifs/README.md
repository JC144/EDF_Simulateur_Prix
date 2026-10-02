# Ajouter ou mettre à jour un tarif

Les tarifs sont définis dans `scripts/tarifs/<fournisseur>/*.js` avec la fonction
`defineTarif(...)` (bibliothèque `scripts/tarifs-lib/define-tarif.js`). Une définition
est un objet littéral pur : **aucune fonction à écrire**, la validation signale les
erreurs en français dans la console du navigateur et fait échouer les tests.

## Unités

- **Abonnement** : € par mois, par puissance souscrite en kVA.
- **Prix du kWh** : **centimes** d'euro (ex. `19.27` = 0,1927 €/kWh).
- **Dates** : `"AAAA/MM/JJ"` dans les calendriers, `"AAAA-MM-JJ"` pour `lastUpdate`.
- **Heures** : `"HH:MM"`, minutes `00` ou `30`. Minuit en fin de plage s'écrit `"24:00"`.

## Recettes

### Mettre à jour un prix

Modifier la valeur dans `subscriptions` / `dayTypes` du fichier concerné, mettre à jour
`lastUpdate`, puis régénérer les snapshots de tests et vérifier que le diff correspond :

```
UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"
git diff tests/golden
cd import && npm run gen    # page tarifs/<slug>.html, section « Tarifs suivis », sitemap
```

### Tarif à prix unique (type Base)

```js
defineTarif({
    name: "Fournisseur - Offre",
    offer_type: "Marché",              // ou "TRV"
    lastUpdate: "2026-02-01",          // date de la grille de prix
    isCommunity: true,                 // true pour un tarif maintenu par la communauté
    subscription_url: "https://...",   // page de souscription
    price_url: "https://...",          // grille tarifaire officielle (PDF)
    subscriptions: { 6: 15.65, 9: 19.56, 12: 23.32 },
    dayTypes: { bleu: { price: 19.27 } }
    // pas de hcRanges : prix unique
});
```

Si le prix varie selon la puissance : `priceOverrides: { 3: { bleu: { price: 19.40 } } }`.

### Tarif heures pleines / heures creuses

```js
defineTarif({
    // ... métadonnées et subscriptions ...
    dayTypes: { bleu: { HP: 20.65, HC: 15.79 } },
    hcRanges: "custom"   // plages saisies par l'utilisateur dans le simulateur
});
```

Pour des plages fixes imposées par l'offre :
`hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]`.

### Tarif week-end (jours fixes dans la semaine)

```js
defineTarif({
    // ...
    dayTypes: { bleu: { price: 20.38 }, weekend: { price: 15.38 } },
    dayRule: { type: "weekly", default: "bleu", days: { weekend: [0, 6] } }
    // 0 = dimanche ... 6 = samedi
    // + userDaySetting: "jourZenPlus" si l'utilisateur choisit un jour supplémentaire
});
```

### Fenêtre horaire à prix réduit (type Happy Hours / heures super creuses)

Un tarif à jour constant peut basculer sur un autre type pendant une plage horaire
fixe (bornes en heures entières). Comme pour le classement HP/HC, le relevé
étiqueté T couvre `]T - pas ; T]` : la fenêtre s'applique donc aux relevés
`]fromHour ; toHour]` (le relevé de `fromHour` pile appartient à la plage
précédente, celui de `toHour` pile à la fenêtre) :

```js
defineTarif({
    // ...
    dayTypes: { base: { HP: 21.62, HC: 16.51 }, hsc: { price: 12.61 } },
    dayRule: {
        type: "constant",
        dayType: "base",
        hourSubTypes: [{ fromHour: 2, toHour: 6, dayType: "hsc" }]
    },
    hcRanges: [{ from: "23:00", to: "24:00" }, { from: "00:00", to: "07:00" }]
});
```

### Tarif à calendrier de dates (type Tempo / EJP)

Les listes de dates vivent dans un calendrier partagé (`scripts/tarifs-lib/calendars/`),
réutilisable par plusieurs fournisseurs :

```js
// scripts/tarifs-lib/calendars/tempo-edf.js
defineCalendar("tempo-edf", {
    rouge: { numberOfDays: 22, monthBegin: 11, monthEnd: 3, days: ["2024/01/08", /* ... */] },
    blanc: { numberOfDays: 43, monthBegin: 10, monthEnd: 6, days: [/* ... */] }
});
```

```js
defineTarif({
    // ...
    dayTypes: {
        bleu:  { HP: 16.12, HC: 13.25 },
        blanc: { HP: 18.71, HC: 14.99 },
        rouge: { HP: 70.60, HC: 15.75 }
    },
    dayRule: {
        type: "calendar",
        default: "bleu",
        calendar: "tempo-edf",
        previousDayBefore: 6   // avant 6h du matin, la couleur est celle de la veille
                               // (omettre pour un calendrier sans report, ex. EJP)
    },
    hcRanges: [{ from: "22:00", to: "24:00" }, { from: "00:00", to: "06:00" }]
});
```

**Ajouter une date Tempo** = ajouter la date dans `tarifs-lib/calendars/tempo-edf.js`,
un seul fichier à modifier.

### Tarif saisonnier (type Zen Estival)

```js
dayRule: {
    type: "season",
    seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } },
    previousDayBefore: 6,
    hourSubTypes: {   // sous-types horaires (ex. heures super creuses)
        ete: [{ fromHour: 11, toHour: 18, dayType: "eteSC" }]
    }
},
hcRanges: { byDayType: { hiver: [/* plages */], hiverSC: [/* ... */], ete: [], eteSC: [] } }
```

Chaque saison et chaque sous-type doit avoir son entrée dans `dayTypes` et dans
`hcRanges.byDayType` (liste vide `[]` = aucune heure creuse pour ce type).

Un type peut être déclaré `{ price: ... }` au milieu de types `{ HP, HC }` : il n'a
alors qu'un prix HC (utile pour un sous-type entièrement couvert par ses plages HC,
comme les heures super creuses de Zen Estival).

### Tarif saison × week-end (type Enercoop Flexibilité)

Chaque saison peut déclarer un type week-end ; le jour de semaine est évalué sur la
même date décalée que la saison quand `previousDayBefore` est présent (une nuit de
dimanche avant 6h compte comme du week-end) :

```js
dayRule: {
    type: "season",
    seasons: {
        hiver: { months: [11, 12, 1, 2, 3], weekendType: "hiverWeekend" },
        ete:   { months: [4, 5, 6, 7, 8, 9, 10], weekendType: "eteWeekend" }
    },
    weekendDays: [0, 6],    // 0 = dimanche ... 6 = samedi
    previousDayBefore: 6
},
hcRanges: {
    byDayType: {
        hiver: [/* plages */], ete: [/* ... */],
        hiverWeekend: [{ from: "00:00", to: "24:00" }],   // tout week-end en HC
        eteWeekend: [{ from: "00:00", to: "24:00" }]
    }
}
```

`weekendType` et `hourSubTypes` ne peuvent pas être combinés sur la même règle.

### Tarif saison + jours calendrier (type OctoTempo)

Des jours issus d'un calendrier partagé peuvent surcharger la saison (le report
de veille `previousDayBefore` s'applique aussi à ces jours) :

```js
dayRule: {
    type: "season",
    seasons: { hiver: { months: [11, 12, 1, 2, 3] }, ete: { months: [4, 5, 6, 7, 8, 9, 10] } },
    previousDayBefore: 6,
    calendarOverride: { calendar: "tempo-edf", types: ["rouge"] }
},
hcRanges: { byDayType: { rouge: [/* plages */], hiver: [/* ... */], ete: [/* ... */] } }
```

`calendarOverride` ne peut être combiné ni avec `weekendType` ni avec `hourSubTypes`.

### Tarif au prix spot (type Sobry)

Le prix du kWh varie à chaque créneau selon une série de prix de marché
partagée (EPEX FR Day-Ahead), déclarée par `defineSpotPrices` dans
`scripts/tarifs-lib/spot/` (fichiers annuels générés par
`import/spot-update.mjs`, valeurs en EUR/MWh, 24 ou 96 par jour). Le tarif
référence la série et déclare les composantes de sa formule — en
**centimes/kWh hors TVA**, `tva` étant un multiplicateur :

```js
dayRule: { type: "spot", source: "epex-fr" },
spotFormula: {
    turpe: { hiver: 6.32, ete: 1.49 },   // TURPE variable moyen saisonnier
    accise: 3.085,
    cap: { hiver: 25.00, ete: 14.17 },   // plafond sur (spot + turpe + accise)
    conformite: 1.00,                     // CEE + mécanisme de capacité
    marge: 0.80,
    prime: 0.70,                          // prime de couverture (hors plafond)
    tva: 1.20
}
```

Prix d'un créneau : `(min(spot + turpe[saison] + accise, cap[saison]) +
conformite + marge + prime) × tva`, avec les saisons TURPE codées en dur
(hiver = novembre à mars). `dayTypes`, `hcRanges` et `priceOverrides` sont
interdits : la conso est agrégée sous l'unique bande « Prix spot ». Un jour
sans données spot (avant 2023, trou de l'API) est marqué en erreur pour ce
tarif seulement. Le fichier de données doit être chargé **avant** le tarif
dans `scripts/tarifs-manifest.js`.

## Déclarer le fichier

Ajouter son chemin dans `scripts/tarifs-manifest.js`, **après** les scripts
`tarifs-lib` et les calendriers utilisés (l'ordre du manifeste est l'ordre
d'exécution) :

```js
    "scripts/tarifs/monfournisseur/monoffre.js",
```

Les scripts de tarifs ne sont pas chargés avec l'accueil : l'application les
injecte au lancement du comparatif (`loadTarifs` de
`scripts/core/tarifsRegistry.js`). Les tests et les outils `import/` lisent la
même liste.

Puis générer sa page de grille (`tarifs/<slug>.html`, slug dérivé du `name`) et
mettre à jour la section « Tarifs suivis » de l'accueil et le sitemap :

```
cd import && npm run gen
```

Un nouveau dossier fournisseur doit aussi être ajouté à la table `PROVIDERS` de
`import/lib/site-gen.mjs` (nom commercial affiché).

## Vérifier

```
node --test "tests/**/*.test.mjs"
cd import && npm test      # inclut « pages du site à jour » (sinon : npm run gen)
```

Un nouveau tarif fait échouer les tests golden (résultats de simulation figés) : c'est
normal, régénérer avec `UPDATE_GOLDEN=1` et vérifier que le diff des fichiers
`tests/golden/*.json` ne touche que le nouveau tarif. Voir `tests/README.md`.
