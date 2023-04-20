/// <reference path="../_lib/p5.global-mode.d.ts" />

// INITIAL SETUP //
let mic;

let waterHeight = 200;
let animation = false;
let waveOffset = 0;
let waveSpeed = 0.05;
let waveHeight = 10;
let waterMargin = 30;
let speedwater = 0.5;
let time = Math.floor(Math.random() * 20000) + 10000; //entre 10 et 30 sec

function draw() {
  
}

function startWaterRising() {
  animation = true;
}

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var swarm = [];
var friction  = 0.999;
var swarmCount = 80;

var avoidStrength = 0.02;

function setup() { 
  createCanvas(720, 576);
  setTimeout(startWaterRising, time);
  
  for (var i=0; i<swarmCount; i++){
    let type = getRandomInt(0, 2);
    let color;
    let nuance = getRandomInt(-20, 20);
    switch (type) {
      case 0:
        color = [235 + nuance, 235 + nuance, 235 + nuance];
        break;
      case 1:
        color = [50 + nuance, 205 + nuance, 50 + nuance];
        break;
      case 2:
        color = [225 + nuance, 34 + nuance, 34 + nuance];
        break;
      default:
        break;
    }
    var newA = new Agent(random(100,300), random(100,300),
                         random(-1,1), random(-1,1),
                         type, color, 1000);
    swarm.push(newA);
  }
} 

function draw() {
  let waterState = 255;
  
  background(20, 255);

  for (var agent of swarm){
    agent.draw();
    agent.move();
    agent.avoid();
  }

  // Dessiner l'élément d'eau
  fill(0, 50, 90, 100);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = height - waterHeight + sin(x * 0.01 + waveOffset) * waveHeight;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Faire bouger les vagues
  waveOffset += waveSpeed;
  if (animation == true && waterHeight < height - waterMargin) {
    waterHeight += speedwater;
  } else {
    animation = false;
  }
  
  
}


