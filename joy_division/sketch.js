/// <reference path="../_lib/p5.global-mode.d.ts" />

// INITIAL SETUP //
let mic;

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}

function setup() {
  createCanvas(750, 900);
  frameRate(0.5); // affects the maximum framerate
  randomSeed(Date.now());

  mic = new p5.AudioIn();
  mic.start();
}

// CONSTANT VALUES //
const noiseScale = 0.01; // the higher, the more spiky it gets
const micPower = 2000; // the higher, the more mic input influences the lines
const lineCount = 80; // the more lines, the slower
const strokeWeightValue = 3; // the higher, the thicker the lines gets
const quality = 6; // the lower, the better, but the more performance heavy

function draw() {
  background(0);
  
  //console.log(frameRate());

  // FRAME RESET VALUES //
  let lineLength = width * 0.15;
  let transitionTime = width * 0.15;
  let waveMin = 12;
  let waveMax;
  let randomTweak;
  let duringTransition;
  let margin = height / 10;
  let marginSides = height / 10;
  let lineDistance = (height - margin * 2) / (lineCount + 1);
  let startChange = (width / 2) - (lineLength / 2);
  let endChange = (width / 2) + (lineLength / 2);
  let verticalShift = margin * 1.4;
  let waveValue = 0;
  let noiseValue = 0;
  let noiseValueSecond = 0;
  let verticalShiftNoise = 0;

  for(let j = 0; j < lineCount; j++) {
    // LINE RESET VALUES //
    waveMax = mic.getLevel() * micPower;
    randomTweak = random() * 100;
    verticalShift = verticalShift + lineDistance;
    noiseValue = 0;
    verticalShiftNoise = 0;
    waveValue = waveMin;

    // WAVES //
    stroke(255);
    fill(0);
    beginShape(TESS);
    vertex(marginSides / 2, height * 1.1);
    vertex(marginSides / 2, verticalShift - waveMin * noiseValue * noiseValueSecond);
    let y = 0;
    for (let x = marginSides; x < width - marginSides; x += quality) {
      duringTransition = x >= startChange - transitionTime && x <= startChange
        || x >= endChange && x <= endChange + transitionTime;
      inMiddle = x > startChange && x < endChange;
      if (duringTransition && waveMin < waveMax) {
        waveValue = waveMin + abs(waveMax - waveMin) * (1 - Math.cos(Math.PI * y / transitionTime)) / 2;
        y += quality;
      }
      else if (inMiddle) {
        waveValue = max(waveMax, waveMin);
      }
      else waveValue = waveMin;
      noiseValue = noise(x * noiseScale, randomTweak * (j + 1) * noiseScale);
      noiseValueSecond = noise(x * noiseScale / 2, randomTweak * (j + 1) * noiseScale / 2);
      verticalShiftNoise = (- waveValue) * noiseValue * noiseValueSecond;
      
      stroke(255);
      strokeWeight(strokeWeightValue);
      vertex(x, verticalShift + verticalShiftNoise);
    }
    vertex(width - marginSides / 2, verticalShift - waveMin * noiseValue * noiseValueSecond);
    vertex(width - marginSides / 2, height * 1.1);
    endShape(CLOSE);
  }

  // FRAME //
  fill(0);
  noStroke();
  rect(0, 0, marginSides, height);
  rect(width, 0, -marginSides, height);
  fill(0, 0, 0, 100);
  rect(0, 0, width, height * 0.12);

  // TEXT //
  textAlign(CENTER);
  textFont(univers);
  fill(255);
  textSize(width * 0.12);
  text("JOY DIVISION", width / 2, height * 0.10);
  textSize(width * 0.069);
  text("UNKNOWN PLEASURES", width / 2, height * 0.98);
}