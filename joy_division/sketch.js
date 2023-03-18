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

const lineCount = 20;
const quality = 4; // positive int. the lower, the better, but the more performance heavy
const noiseScale = 0.02;
const strokeW = 3;
const micPower = 1000;

let waveMin = 4;
let waveMax;
let randomTweak;
let mic;

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}

function setup() {
  createCanvas(1000, 1200); //width/2 = 512.55
  frameRate(24);
  randomSeed(Date.now());

  mic = new p5.AudioIn();
  mic.start();
}

const lineLength = 1000 / 6;
const transitionTime = 1000 / 6;

function draw() {
  background(0);
  
  console.log(frameRate());

  let margin = height / 10;
  let marginSides = height / 10;
  let lineDistance = (height - margin * 2) / (lineCount + 1);
  let startChange = (width / 2) - (lineLength / 2);
  let endChange = (width / 2) + (lineLength / 2);
  let verticalShift = margin * 1.4;
  let waveValue = 0;

  for(let j = 0; j < lineCount; j++) {
    //waveMax = mic.getLevel() * micPower;
    waveMax = 100;
    randomTweak = random() * 100;
    verticalShift = verticalShift + lineDistance;
    let verticalShiftNoiseList = new Array();
    let noiseValue = 0;
    let verticalShiftNoise = 0;

    stroke(255);
    fill(0);
    beginShape(TESS);
    vertex(marginSides / 2, height * 1.1);
    vertex(marginSides / 2, verticalShift);
    let y = 0;
    for (let x = marginSides; x < width - marginSides; x += quality) {
      let adjust = waveMax * Math.sin(y * Math.PI * quality / transitionTime);
      if (x > startChange && x < endChange) {
        waveValue = max(waveMax, waveMin);
      }
      else if (x > startChange - transitionTime && x < startChange) {
        if (waveValue < waveMax) {
          waveValue = waveValue + adjust;
          y++;
        }
      }
      else if (x > endChange && x <= endChange + transitionTime) {
        if (waveValue > waveMin) {
          waveValue = waveValue - adjust;
          y--;
        }
      }
      else if (x < startChange || x > endChange) {
        waveValue = waveMin;
      }
      noiseValue = noise(x * noiseScale, randomTweak * (j + 1) * noiseScale);
      verticalShiftNoise = - noiseValue * waveValue;
      verticalShiftNoiseList.push(verticalShiftNoise);
      
      stroke(255);
      strokeWeight(strokeW);
      vertex(x, verticalShift + verticalShiftNoise);
    }
    vertex(width - marginSides / 2, verticalShift);
    vertex(width - marginSides / 2, height * 1.1);
    endShape(CLOSE);
  }
  fill(0);
  noStroke();
  rect(0, 0, marginSides, height);
  rect(width, 0, -marginSides, height);
  textAlign(CENTER);
  textFont(univers);
  fill(255);
  textSize(width * 0.12);
  text("JOY DIVISION", width / 2, height * 0.10);
  textSize(width * 0.069);
  text("UNKNOWN PLEASURES", width / 2, height * 0.98);
}