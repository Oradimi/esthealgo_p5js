/// <reference path="../_lib/p5.global-mode.d.ts" />

// INITIAL SETUP //
let mic;

/*let waterHeight = 200;
let waveOffset = 0;
let waveSpeed = 0.05;
let waveHeight = 10;
let waterMargin = 30;
let speedwater = 0.5;
let animation = false;*/

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

let water;

let time = Math.floor(Math.random() * 20000) + 10000; //entre 10 et 30 sec

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startRising() {
  water.animation = true;
}

var swarm = [];
var swarmHealth;
var swarmCount = 80;
let swarmBadCount = 0;
let swarmGoodCount = 0;
var friction  = 0.999;

var avoidStrength = 0.02;

function setup() { 
  createCanvas(720, 576);
  water = new Water(366);
  setTimeout(startRising, time);
  
  
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
        swarmGoodCount += 1;
        break;
      case 2:
        color = [225 + nuance, 34 + nuance, 34 + nuance];
        swarmBadCount += 1;
        break;
      default:
        break;
    }
    var newA = new Agent(random(367,height), random(367,height),
      random(-1,1), random(-1,1), type, color, getRandomInt(300, 1000));
    swarm.push(newA);
  }
} 

function draw() {
  let waterState = 255;
  
  background(20, 255);

  // Dessiner l'élément d'eau
  water.color = 50 + (swarmCount / 10 + swarmGoodCount) / (swarmCount / 10 + swarmBadCount) * 30;
  fill(0, 50, water.color, 100);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = height - water.height + sin(x * 0.01 + water.waveOffset) * water.waveHeight;
    water.level = height - water.height - water.waveHeight;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Faire bouger les vagues
  water.waveOffset += water.waveSpeed;
  water.height += water.speed;
  water.height = clamp(water.height, 200, height - water.margin);
  water.speed = (swarmBadCount - swarmGoodCount) / swarmCount;
  water.speed = clamp(water.speed, 0, 0.8);

  // Faire les boids
  for (var agent of swarm){
    agent
    if (agent.health < 0) {
      switch (agent.type) {
        case 0:
          break;
        case 1:
          swarmGoodCount += -1;
          break;
        case 2:
          swarmBadCount += -1;
          break;
        default:
          break;
      }
      swarm.remove(agent);
      swarmCount += -1;
    }
    agent.draw();
    agent.move();
    agent.avoid();
  }
}


