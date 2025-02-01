# EDF_Simulateur_Prix
Un outil pour simuler les différents tarifs de fournisseurs d'électricité depuis un export Linky de la consommation.

[Version en ligne: https://comparateur-abonnements-electricite.fr](https://comparateur-abonnements-electricite.fr)

## Derniers tarifs: 
* EDF : 2025-02-01
* Alpiq : 01 Février 2024
* Alterna : 01 Février 2024
* ~~Ekwateur : 30 janvier 2024~~
* Enercoop : 01 Février 2024
* Engie : 01 Février 2024
* ES : 01 Février 2024
* Ilek : 01 Février 2024
* La belle énergie : 01 Février 2024
* Mint Energie : 01 Février 2024
* Octopus : 2024-05-13
* OHM Energie : 01 Février 2024
* ~~Switch : 01 Février 2024~~ [Voir ici](https://www.jechange.fr/energie/chez-switch/)
* TotalEnergie : 01 Février 2024

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

## Comment contribuer
Vous trouverez la documentation dans le [wiki](https://github.com/JC144/EDF_Simulateur_Prix/wiki).

## Utilisation

### Depuis le site d'EDF
1. Récupérez sur le site d'EDF votre consommation [https://suiviconso.edf.fr/comprendre](https://suiviconso.edf.fr/comprendre)
![Bouton télécharger](https://user-images.githubusercontent.com/1168432/216930725-d3af991d-7761-40bc-892f-285d11390fd8.png)
2. Dézippez ce répertoire

### Depuis le site d'Enedis
1. Depuis le site d'Enedis: [https://mon-compte-particulier.enedis.fr/mes-telechargements-mesures/](https://mon-compte-particulier.enedis.fr/mes-telechargements-mesures/)
2. Cliquez sur "Nouveau Téléchargement" en haut à droite
3. Sélectionnez "Consommation horaire"
4. Cliquez sur Date de début et cherchez la date la plus ancienne
5. Cliquez sur Télécharger mes données
6. Revenez plus tard sur la page "Mes téléchargements". La génération du fichier n'est pas immédiate
7. Quand une nouvelle ligne apparaît sur cette page, cliquez sur la flèche pour télécharger

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

### Accéder à ce comparateur
Vos données seront traitées en local, aucune donnée ne sera envoyée vers un serveur.
Vous pouvez accéder à l'outil depuis cette url : [http://jc144.github.io/EDF_Simulateur_Prix](http://jc144.github.io/EDF_Simulateur_Prix)
**Ou** vous pouvez le télécharger pour une utilisation hors ligne :
1. Téléchargez ce projet en cliquant sur le bouton code puis "Download zip"
![Comment récupérer le projet](https://user-images.githubusercontent.com/1168432/216541398-0d862d3f-30d6-4b08-9e79-7e3d5a1cdfef.png)
2. Dézippez-le
3. Double-cliquez sur le fichier index.html. Il devrait s'ouvrir dans votre navigateur.

### Utiliser ce comparateur
1. Cliquez sur parcourir et sélectionnez votre fichier
  * Pour EDF : "mes-puissances-atteintes-30min-XXXXX-YYYYY.csv" **(Ne modifiez pas le nom du fichier!)**
  * Pour Ennedis : "Enedis_Conso_Heure_DATEDEBUT-DATEFIN_XXXXX.csv" **(Ne modifiez pas le nom du fichier!)**
2. A partir de là, vous pouvez choisir les différentes tarifications que vous voulez expérimenter !

## A propos de l'auteur
[Jean-Christophe VASSELON](https://www.linkedin.com/in/jvasselon/), 
Aussi éditeur [d'un outil de gestion de patientèle pour diététicien(ne)s](https://www.patientailes.com).
