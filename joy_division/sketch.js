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

const nombreLigne = 8;
const longueur = 100;
const dureeTransition = 100;
const nbPoints = 10;
const noiseScale = 0.02;
const boostSetup = 4;
const strokeW = 2;
const micPower = 2000;

let variation;
let mic;
let volume;

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}



function setup() {
  createCanvas(500, 600); //width/2 = 512.55
  frameRate(60);
  background(0);
  randomSeed(Date.now());

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(0);
  volume = mic.getLevel() * micPower;

  let margin = 60;
  let margin_sides = 60;
  let espaceLigne = (height - margin * 2) / (nombreLigne + 1);
  let startChange = (width / 2) - (longueur / 2);
  //let startChange = 100;
  let endChange = (width / 2) + (longueur / 2);
  let hauteur = margin * 1.4;

  for(let j = 0; j < nombreLigne; j++) {
    variation = 100;
    let randomSeed = random() * 100;
    
    hauteur = hauteur + espaceLigne;
    //let ligneUnique = random() * 70;;
    let ligneUnique = 0;

    let boost = 0;
    let ajout = variation * nbPoints / dureeTransition;
    stroke("white");
    noFill();
    beginShape(LINE_STRIP);
    for (let x = margin_sides; x < width - margin_sides; x += nbPoints) {
      if (x > startChange && x < endChange) {
        boost = variation;
      }
      else if (x > startChange && x < startChange) {
        if (boost < variation) {
          boost = boost + ajout;
        }
      }
      else if (x > endChange && x < endChange) {
        if (boost > variation) {
          boost = boost - ajout;
        }
      }
      else if (x < startChange || x >= endChange) {
        boost = boostSetup;
      }
      let noiseVal = noise(x * noiseScale, randomSeed * (j + 1) * noiseScale);
      let scale = -noiseVal * boost;
      let noiseVal2 = noise((x+1) * noiseScale, randomSeed * (j + 2) * noiseScale);
      let scale2 = -noiseVal2 * boost;
      
      stroke(255);
      vertex(x, hauteur + scale);
      
      
      /*strokeWeight(strokeW);
      stroke(255);
      line(x, hauteur + scale, x, hauteur + scale + 2);
      strokeWeight(strokeW);
      stroke(0);
      line(x, height + scale, x, hauteur + scale + 2);*/
    }
    endShape();
  }
  /*fill(0);
  noStroke();
  rect(0, 0, width / 8, height);
  rect(width, 0, -width / 8, height);*/
  textAlign(CENTER);
  textFont(univers);
  noStroke();
  fill(255);
  textSize(width * 0.12);
  text("JOY DIVISION", width / 2, margin);//m
  textSize(width * 0.072);
  text("UNKNOWN PLEASURES", width / 2, height * 0.99);
}