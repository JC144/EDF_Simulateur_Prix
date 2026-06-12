// Test d'intégration "chargement navigateur" pour les offres Sobry.
// Reproduit l'ordre de chargement réel d'index.html : data/spot-fr.js pose le
// global window.spotPrices via une balise <script> (PAS de fetch), puis les
// offres et le calculateur s'en servent. Garde-fou contre la régression où
// window.spotPrices n'est jamais chargé → énergie facturée 0 (abonnement seul).
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

// --- Simulation de l'environnement navigateur ---
global.window = global;
global.abonnements = [];
require('../../scripts/tarifs/sobry/sobryPricing.js'); // pose window.sobryPricing

// data/spot-fr.js doit poser window.spotPrices, exactement comme la balise <script>
eval(read('data/spot-fr.js'));
assert.ok(
    window.spotPrices && Array.isArray(window.spotPrices.prices) && window.spotPrices.prices.length > 0,
    'data/spot-fr.js doit charger window.spotPrices (régression : prix spot non chargés)'
);

// Charge les deux offres (référencent les globals abonnements + sobryPricing)
eval(read('scripts/tarifs/sobry/socap.js'));
eval(read('scripts/tarifs/sobry/soflex.js'));
const { calculator } = require('../../scripts/calculator.js');

const socap = abonnements.find(a => a.name === 'Sobry - SoCap');
const soflex = abonnements.find(a => a.name === 'Sobry - SoFlex');
assert.ok(socap && soflex, 'les deux offres Sobry doivent être enregistrées');

// Journée d'hiver couverte par le spot (prix élevés → le plafond SoCap joue),
// 24 pas horaires de 1000 Wh = 24 kWh.
const hours = [];
for (let h = 0; h < 24; h++) hours.push([`${String(h).padStart(2, '0')}:00:00`, '1000']);
const sample = [{ date: '2025/01/15', hours }];

function dayEnergy(grille) {
    const day = calculator.getTarif(6, sample, grille)[0].days[0];
    assert.ok(!day.spotMissing, `${grille.name}: la journée doit être couverte par le spot`);
    return day.hours.reduce((a, b) => a + (isNaN(b.price) ? 0 : b.price), 0);
}

const eSocap = dayEnergy(socap);
const eSoflex = dayEnergy(soflex);

// Le bug réel : énergie ≈ 0 (seul l'abonnement restait). On exige un coût énergie
// substantiel sur 24 kWh d'hiver (largement > 1 €).
assert.ok(eSocap > 1, `énergie SoCap doit être non nulle (était ~0), obtenu ${eSocap}`);
assert.ok(eSoflex > 1, `énergie SoFlex doit être non nulle (était ~0), obtenu ${eSoflex}`);

// En hiver à prix spot élevé, le plafond SoCap (0,2167) est plus bas que SoFlex
// (0,3333) → SoCap est moins cher. Les deux offres NE doivent PAS être identiques.
assert.ok(eSocap < eSoflex, `SoCap (${eSocap.toFixed(3)}) doit différer de SoFlex (${eSoflex.toFixed(3)}) en hiver`);

// Sans prix spot (ex. fichier ouvert en file:// du temps où on utilisait fetch),
// TOUS les jours sont spotMissing → c'est le signal qui permet à l'UI d'afficher
// « Prix spot indisponibles » au lieu d'un coût trompeur réduit à l'abonnement.
delete window.spotPrices;
const noSpot = calculator.getTarif(6, sample, socap);
assert.ok(noSpot[0].days.every(d => d.spotMissing), 'sans spot : tous les jours marqués spotMissing');
assert.ok(noSpot[0].spotMissing, 'sans spot : mois marqué spotMissing (pilote l\'erreur explicite UI)');

console.log('Sobry integration OK');
