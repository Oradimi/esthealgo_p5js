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
var swarmCount = 40;
let swarmBadCount = 0;
let swarmGoodCount = 0;
var friction  = 0.999;

var avoidStrength = 0.02;

function setup() { 
  createCanvas(720, 576);
  water = new Water(366);
  //setTimeout(startRising, time);
  
  
  for (var i = 0; i < swarmCount; i++){
    let type = getRandomInt(0, 2);
    let color;
    let nuance = getRandomInt(-20, 10);
    switch (type) {
      case 0:
        color = [245 + nuance, 245 + nuance, 221 + nuance];
        break;
      case 1:
        color = [173 + nuance, 216 + nuance, 229 + nuance];
        swarmGoodCount += 1;
        break;
      case 2:
        color = [123 + nuance, 33 + nuance, 126 + nuance];
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

function mousePressed() {
  for (var agent of swarm){
    if (agent.type == 0) {
      agentClicked = (
        mouseX >= agent.pos.x - agent.wordWidth &&
        mouseX <= agent.pos.x + agent.wordWidth &&
        mouseY <= agent.pos.y + agent.wordSize * 0.4 && 
        mouseY >= agent.pos.y - agent.wordSize * 0.6)
      if (agentClicked) {
        let type = getRandomInt(0, swarmCount + 30);
        if (type < 10 + swarmBadCount) {
          type = 1;
        } else if (type < 20 + swarmBadCount + swarmGoodCount) {
          type = 2;
        } else {
          type = 0;
        }
        let generation = 0;
        (type == 0) ? generation = clamp(Math.floor(agent.health / 400), 1, 3) :
          generation = clamp(Math.floor(agent.health / 80), 3, 15);
        for (var i = 0; i < generation; i++) {
          let color;
          let nuance = getRandomInt(-20, 10);
          switch (type) {
            case 0:
              color = [245 + nuance, 245 + nuance, 221 + nuance];
              swarmCount += 1;
              break;
            case 1:
              color = [173 + nuance, 216 + nuance, 229 + nuance];
              swarmGoodCount += 1;
              swarmCount += 1;
              break;
            case 2:
              color = [123 + nuance, 33 + nuance, 126 + nuance];
              swarmBadCount += 1;
              swarmCount += 1;
              break;
            default:
              break;
          }
          var newA = new Agent(agent.pos.x + random(-5,5), agent.pos.y,
            random(-1,1), random(-1,1), type, color, getRandomInt(300, 700));
          swarm.push(newA);
        }
        swarm.remove(agent);
        swarmCount += -1;
      }
    }
  }
  console.log()
  
}

function draw() {
  let waterState = 255;
  background(20, 255);
  water.color = 20 + ((swarmCount / 10 + swarmGoodCount) / (1 + swarmCount / 10 + swarmBadCount)) * 70;
  water.color = clamp(water.color, 20, 100);
  background(0, 50, water.color, 100);
  
  /* DISPLAY WORD COUNTS */
  /*fill(255);
  textSize(24);
  text(swarmCount, 50, 25);
  text(swarmGoodCount, 150, 25);
  text(swarmBadCount, 250, 25);*/

  // Dessiner l'élément d'eau
  /*water.color = 20 + ((swarmCount / 10 + swarmGoodCount) / (1 + swarmCount / 10 + swarmBadCount)) * 70;
  water.color = clamp(water.color, 20, 100);
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
  endShape(CLOSE);*/

  // Faire bouger les vagues
  water.waveOffset += water.waveSpeed;
  water.height += water.speed;
  water.height = clamp(water.height, 200, height - water.margin);
  water.speed = (swarmBadCount - swarmGoodCount) / swarmCount;
  water.speed = clamp(water.speed, 0, 0.3);

  // Faire les boids
  let onlyOneTypeLeft = true;
  let typeToCheck = swarm[0].type;
  for (var agent of swarm){
    if (agent.type != typeToCheck) onlyOneTypeLeft = false;
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
      if (random(0, 100) < 10) {
        let nuance = getRandomInt(-20, 10);
        let color = [245 + nuance, 245 + nuance, 221 + nuance];
        var newA = new Agent(agent.pos.x + random(-5,5), agent.pos.y,
            random(-1,1), random(-1,1), 0, color, getRandomInt(500, 1200 - swarmCount * 3));
        swarm.push(newA);
        swarmCount += 1;
      }
      swarm.remove(agent);
      swarmCount += -1;
    }

    agent.draw();
    agent.move();
    agent.avoid();
  }

  if (onlyOneTypeLeft) {
    for (let i = 0; i < 10; i++) {
      let nuance = getRandomInt(-20, 10);
      let color = [245 + nuance, 245 + nuance, 221 + nuance];
      var newA = new Agent(random(367, height), random(367, height),
          random(-1,1), random(-1,1), 0, color, getRandomInt(500, 1200 - swarmCount * 3));
      swarm.push(newA);
      swarmCount += 1;
    }
  }
}


