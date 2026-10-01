# EDF_Simulateur_Prix
Un outil pour simuler les différents tarifs de fournisseurs d'électricité depuis un export Linky de la consommation.

[Version en ligne: https://comparateur-abonnements-electricite.fr](https://comparateur-abonnements-electricite.fr)

## ☀️ Méga-Update estivale ☀️
* **Import Enedis simplifié** : récupérez votre consommation directement depuis votre navigateur, sans extension ni service tiers
* **Questionnaire initial repensé**
  * Assistant pas-à-pas plus ergonomique
  * Retour en arrière possible à chaque étape
  * Champs de saisie plus lisibles
* **Comparateur de prix**
  * Répartition de la consommation par type de prix (heures pleines, heures creuses, etc.) **en kWh** ou **en euros**
  * Performances nettement améliorées et consommation mémoire fortement réduite
  * Indicateur signalant les mois pour lesquels il manque des jours de consommation
* **Abonnements**
  * Mise à jour automatique des prix de la plupart des abonnements (depuis les grilles tarifaires officielles)
  * Récupération automatique des jours Tempo, EJP et ZenFlex
  * Prise en charge des tarifs spot (notamment les offres Sobry)
* **À venir** : estimation du potentiel solaire

## Utilisation

### Accéder à ce comparateur
Vos données seront traitées en local, aucune donnée ne sera envoyée vers un serveur.
Vous pouvez accéder à l'outil depuis cette url : [https://comparateur-abonnements-electricite.fr](https://comparateur-abonnements-electricite.fr)

**Ou** vous pouvez le télécharger pour une utilisation hors ligne :
1. Téléchargez ce projet en cliquant sur le bouton code puis "Download zip"
![Comment récupérer le projet](https://user-images.githubusercontent.com/1168432/216541398-0d862d3f-30d6-4b08-9e79-7e3d5a1cdfef.png)
2. Dézippez-le
3. Lancez un petit serveur web local dans le répertoire dézippé (l'application utilise des modules JavaScript, que les navigateurs refusent de charger en ouvrant directement le fichier). Par exemple, si Python est installé : `python -m http.server 8000`
4. Ouvrez [http://localhost:8000](http://localhost:8000) dans votre navigateur. Vos données restent sur votre machine.

### Utiliser ce comparateur
1. Cliquez sur parcourir et sélectionnez votre fichier
  * Pour EDF : "mes-puissances-atteintes-30min-XXXXX-YYYYY.csv" **(Ne modifiez pas le nom du fichier!)**
  * Pour Ennedis : "Enedis_Conso_Heure_DATEDEBUT-DATEFIN_XXXXX.csv" **(Ne modifiez pas le nom du fichier!)**
2. A partir de là, vous pouvez choisir les différentes tarifications que vous voulez expérimenter !

### Depuis le site d'EDF
1. Récupérez sur le site d'EDF votre consommation [https://suiviconso.edf.fr/comprendre](https://suiviconso.edf.fr/comprendre)
![Bouton télécharger](https://user-images.githubusercontent.com/1168432/216930725-d3af991d-7761-40bc-892f-285d11390fd8.png)
2. Dézippez ce répertoire

### Depuis le site d'Enedis
1. Suivez les instructions directement dans l'outil (en déroulant le menu "Comment récupérer les données de mon fournisseur ?")

### Depuis le site de TotalEnergies
1. Depuis le site de TotalEnergies [https://www.totalenergies.fr/clients/ma-conso](https://www.totalenergies.fr/clients/ma-conso)
2. Cliquez sur "Électricité"
3. Sélectionnez "Heure", par défaut vous serez sur "Echéancier"
4. Cliquez sur le bouton Télécharger, cela va télécharger les données depuis la mise en place de votre Linky, dans une limite de 3 ans

### Depuis le site de Strasbourg Electricité
1. Depuis le site de [Strasbourg Electricité Réseaux](https://maconsolinky.strasbourg-electricite-reseaux.fr)
2. Cliquez sur "Courbe de charge".
3. Choisissez, si possible, une période d'au moins 1 an via le bouton "Personnalisé".
4. Cliquez sur "Exporter les données"
5. Utilisez le fichier (sans le renommer) : "export_courbe_charges.csv"

### Depuis votre export HomeAssistant
HomeAssistant est une plateforme de domotique Open-Source.
Certains outils permettent un export de la consommation au quart d'heure.
Vérifiez que votre export s'appelle bien history.csv.

## Comment contribuer
Toutes les contributions sont les bienvenues, via une Pull Request vers `main` (fork + branche). Avant d'ouvrir la PR, vérifiez que les tests passent : `node --test "tests/**/*.test.mjs"` (Node ≥ 22).

* **Ajouter un tarif** — suivez le guide [scripts/tarifs/README.md](scripts/tarifs/README.md) : les tarifs sont des définitions déclaratives `defineTarif(...)` dans `scripts/tarifs/<fournisseur>/*.js` (aucune fonction à écrire), avec des recettes pour chaque type d'offre (Base, HP/HC, week-end, calendrier type Tempo, saisonnier, prix spot). N'oubliez pas la balise `<script>` correspondante dans `index.html`, puis générez la page de grille du tarif (`cd import && npm run gen`, voir [Pages de grille tarifaire](#pages-de-grille-tarifaire)).
* **Mettre à jour un tarif** — modifiez les prix et `lastUpdate` dans le fichier concerné, puis suivez la [procédure de mise à jour](#mise-à-jour-des-données-tarifaires) (snapshots de simulation, pages de grille, relecture du diff).
* **Créer un importateur pour un fournisseur non géré** (Engie, Sobry, grilles HTML…) — ajoutez un parser `import/parsers/<fournisseur>.mjs` respectant le contrat `parse(doc, url) -> { gridDate, offers }` (clés = `name` des `defineTarif`, prix kWh en centimes TTC, abonnements en €/mois TTC). Les outils `import/tools/` (`dump-text.mjs`, `try-parser.mjs`, `gen-expected.mjs`) permettent d'itérer sur des fixtures locales, avec des tests sans réseau — voir [import/README.md](import/README.md).
* **Corriger ou améliorer l'application** (parsers d'export de consommation, interface, calculs) — l'architecture est décrite dans la section [Développement](#développement) ci-dessous.
* **Signaler un problème ou proposer une offre manquante** — ouvrez une [issue](https://github.com/JC144/EDF_Simulateur_Prix/issues).
* **Ou tout simplement** [laisser un pourboire qui me permet de financer le domaine et l'abonnement IA](https://www.paypal.com/donate/?hosted_button_id=3FRF77WQDZXUU)

## Développement
L'application est 100% statique (aucun build, aucune dépendance à installer), en JavaScript vanilla avec des modules ES :

* `index.html` — page unique : les 3 écrans (présentation, import, résultats), les `<template>` de l'écran de résultats et le chargement des scripts.
* `scripts/app.js` — point d'entrée (module ES) : orchestration entre les vues et la simulation.
* `scripts/ui/` — vues et rendu : `importView.js` (réglages + import CSV), `resultsView.js` (période + rafraîchissement), `resultsRenderer.js` (clonage/hydratation des templates), `viewManager.js` (navigation), `dom.js` (helpers).
* `scripts/core/` — logique métier : `calculator.js` (calculs), `simulation.js` (personnalisation + calcul global), `tarifsRegistry.js` (accès au registre des tarifs).
* `scripts/parsers/` — un parser par format d'export (EDF, Enedis, TotalEnergies, SER, Home Assistant) et `index.js` qui choisit le bon d'après le nom du fichier.
* `scripts/tarifs-registry.js` et `scripts/tarifs/` — registre global `window.abonnements` et fichiers de tarifs (scripts classiques, chargés avant l'application).
* `tarifs/` — une page HTML statique par tarif (grille tarifaire standardisée), **générée** à partir de `scripts/tarifs/` : ne pas éditer à la main (voir [Pages de grille tarifaire](#pages-de-grille-tarifaire)).

Pour développer en local, servez le répertoire via un serveur HTTP (les modules ES ne fonctionnent pas en `file://`) :

```
python -m http.server 8000
```

puis ouvrez [http://localhost:8000](http://localhost:8000).

### Mise à jour des données tarifaires

Le dossier [`import/`](import/README.md) contient les outils locaux (Node ≥ 22) de mise à jour des données : grilles tarifaires PDF des fournisseurs (`price_url` des `defineTarif`, prix patchés automatiquement dans `scripts/tarifs/**`), calendriers Tempo/EJP et Zenflex, prix spot EPEX FR. Première utilisation : `cd import && npm ci`.

Procédure de mise à jour :

1. **Mettre à jour les données** — automatiquement :
   ```
   node import/update-all.mjs
   ```
   qui lance les quatre scripts en parallèle, affiche une synthèse puis **régénère les pages du site** dérivées des tarifs (étape 2). Pour un tarif sans importateur (grilles HTML d'Alterna/Enercoop, Engie…), modifiez à la main les prix et `lastUpdate` dans `scripts/tarifs/<fournisseur>/*.js`.
2. **Régénérer les pages du site** — fait par `update-all.mjs` à chaque lancement. Après une modification manuelle seule :
   ```
   cd import && npm run gen
   ```
3. **Régénérer les snapshots de simulation** (goldens) — ou `node import/update-all.mjs --goldens` à l'étape 1 :
   ```
   UPDATE_GOLDEN=1 node --test "tests/**/*.test.mjs"
   ```
4. **Relire le diff** : il doit correspondre exactement aux changements de prix attendus.
   ```
   git diff scripts/tarifs scripts/tarifs-lib
   git diff tests/golden
   git diff index.html tarifs sitemap.xml
   ```
5. **Lancer les tests**, puis commiter le tout (données, goldens et pages générées ensemble) :
   ```
   node --test "tests/**/*.test.mjs"
   cd import && npm test
   ```
   `npm test` échoue si les pages générées ne sont plus à jour (`npm run gen` oublié).

`node import/update-all.mjs --dry-run` (ou `--check-only`) exécute tout sans rien écrire et se contente de signaler les pages à régénérer. Détails et options : [import/README.md](import/README.md).

### Pages de grille tarifaire

Chaque tarif a sa page statique `tarifs/<slug>.html` (slug dérivé du nom du tarif, ex. `EDF - Tempo` → `tarifs/edf-tempo.html`), au même gabarit pour toutes les offres : date de la grille, lien vers l'offre et vers la grille officielle (PDF), abonnement par puissance, prix du kWh, heures creuses et règle des types de jour. Un avertissement s'affiche dans le navigateur quand la grille a plus de 6 mois. L'accueil (section « Tarifs suivis ») et le tableau de résultats du simulateur (« Détails de l'offre ») renvoient vers ces pages.

Ces pages, la section « Tarifs suivis » d'`index.html` et les entrées correspondantes de `sitemap.xml` sont **générées** par `import/tools/gen-tarif-pages.mjs` et `import/tools/gen-tarifs-section.mjs` (lancés ensemble par `cd import && npm run gen`) et committées telles quelles : ne les éditez pas à la main, modifiez le tarif puis régénérez. Un tarif retiré ou renommé voit son ancienne page supprimée à la génération suivante. Un nouveau fournisseur doit être ajouté à la table `PROVIDERS` de `import/lib/site-gen.mjs`.

### Prix spot (tarifs Sobry)

Les tarifs indexés sur le marché (Sobry SoCap/SoFlex) s'appuient sur les prix
spot EPEX FR Day-Ahead depuis 2023, committés dans `scripts/tarifs-lib/spot/`
(un fichier par année). Mise à jour : via `node import/update-all.mjs` (ou
`node import/spot-update.mjs` seul, incrémental — voir
[import/README.md](import/README.md)).

Données de prix spot : [energy-charts.info](https://energy-charts.info)
(Fraunhofer ISE), source Bundesnetzagentur | [SMARD.de](https://www.smard.de),
licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Remerciements
Basé sur une idée de [Nicolas 'Automnen'](https://twitter.com/autommen/) et [Malory Bouvier](https://twitter.com/MaloryBouvier/).

### Contributeurs
* [Dawey](https://github.com/Daweyy)
* [DuchkPy](https://github.com/DuchkPy)
* [Zarwinch](https://github.com/zarwinch)
* [Benoit Deldicque](https://github.com/bddq)
* [Tom Niget](https://github.com/zdimension)
* [Benoit Goimier](https://github.com/BenoitGoimier)
* [J0hnMatrix](https://github.com/J0hnMatrix)
* [fdonv](https://github.com/fdonv)
* [chatainsim](https://github.com/chatainsim)
* [csailly](https://github.com/csailly)
* [nviallatte](https://github.com/nviallatte)
* [Jonathan Sarrazi](https://github.com/jo-sarrazin)
* [Szepeviktor](https://github.com/szepeviktor)
* [Jason Marechal](https://github.com/JasonMarechal)
* [Lucas Duval](https://github.com/LucasDuval)
* [Pierre Pinon](https://github.com/pierrepinon)
* [Abauzac](https://github.com/abauzac)
* [Ponsifiax](https://github.com/ponsifiax)
* [10tribu](https://github.com/10tribu)
* [libussa](libussa)

## A propos de l'auteur
[Jean-Christophe VASSELON](https://www.linkedin.com/in/jvasselon/)
