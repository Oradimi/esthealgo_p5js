/// <reference path="../_lib/p5.global-mode.d.ts" />

/* Pseudo-code rédigé
Pour chaque ligne, et sur la longueur de la ligne,
si x est proche du milieu, une dessine une somme de sin et cos de x, multipliée par une valeur haute.
Sinon, on utilise du perlin noise utilisant du cos et du sin, multiplié par une valeur très basse.
À la fin, on colore chaque dessous de ligne en noir.
*/

/* Pseudo-code
Pour n allant de 0 à nombre_de_lignes
    Pour x allant de 0 à largeur_de_feuille
        Si x étant entre valeur aléatoire proche du milieu gauche
        et valeur aléatoire proche du milieu droite
            utilisation de perlin noise utilisant du cos et du sin, multiplié par une valeur haute
        Sinon
            utilisation de perlin noise utilisant du cos et du sin, multiplié par une valeur très basse
    Fin Pour
    Colorer le dessous de la ligne en noir
Fin Pour
*/

// FUNCTIONS //
function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * max);
}

const nombreLigne = 80;
const longueur = 150;
let variation = 50;
const dureeTransition = 160;
const noiseScale = 0.02;
const boostSetup = 4;
const strokeW = 2;

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}

function setup() {
  createCanvas(1000, 1200); //width/2 = 512.5
  frameRate(0);
  background(0);

  let margin = height * 0.1;
  let espaceLigne = (height - margin * 2) / (nombreLigne + 1);
  let startChange = (width / 2) - (longueur / 2);
  let endChange = (width / 2) + (longueur / 2);
  let hauteur = margin + espaceLigne * 4;

  for(let j = 0; j < nombreLigne; j++) {
    variation = getRandomInt(30, 70);
    hauteur = hauteur + espaceLigne;
    let ligneUnique = random() * width;
    let boost = 0;
    let ajout = variation / dureeTransition;
    for (let x = -width; x < width * 2; x++) {
      if (x > startChange - ligneUnique && x < endChange - ligneUnique) {
        boost = variation;
      }
      else if (x > startChange - ligneUnique - dureeTransition && x < startChange - ligneUnique) {
        if (boost < variation) {
          boost = boost + ajout;
        }
      }
      else if (x > endChange - ligneUnique && x < endChange - ligneUnique + dureeTransition) {
        if (boost > boostSetup) {
          boost = boost - ajout;
        }
      }
      else if (x < startChange - ligneUnique - dureeTransition || x > endChange - ligneUnique + dureeTransition) {
        boost = boostSetup;
      }
      let noiseVal = noise(x * noiseScale, noiseScale);
      let scale = -noiseVal * boost;
      strokeWeight(strokeW);
      stroke(255);
      line(x + ligneUnique, hauteur + scale, x + ligneUnique, hauteur + scale + 2);
      strokeWeight(strokeW);
      stroke(0);
      line(x + ligneUnique, height, x + ligneUnique, hauteur + scale + 2);
    }
  }
  fill(0);
  noStroke();
  rect(0, 0, width / 8, height);
  rect(width, 0, -width / 8, height);
  textAlign(CENTER);
  textFont(univers);
  fill(255);
  textSize(120);
  text("JOY DIVISION", width / 2, margin);
  textSize(72);
  text("UNKNOWN PLEASURES", width / 2, height * 0.99);
}

function draw() {
}