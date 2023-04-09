/// <reference path="../_lib/p5.global-mode.d.ts" />

// INITIAL SETUP //
let mic;

function preload() {
  univers = loadFont('Univers-light-normal.ttf');
}

var swarm = [];
var friction  = 0.999;
var swarmCount = 80;

var avoidRadius = 120;
var avoidStrength = 0.02;

function setup() { 
  createCanvas(720, 576);
  
  for (var i=0; i<swarmCount; i++){
    var newA = new Agent(random(100,300),random(100,300),random(-1,1), random(-1,1));
    swarm.push(newA);
  }
} 

function draw() { 
  background(20,255);
  
  for (var agent of swarm){
    agent.draw();
    agent.move();
    agent.avoid();
  }
}


