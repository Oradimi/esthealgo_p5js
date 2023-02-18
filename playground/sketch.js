/// <reference path="../_lib/p5.global-mode.d.ts" />

const points = [];
const dimensions = 600;
const amount = 20;

function setup() {
  createCanvas(dimensions, dimensions);
  colorMode(HSB);
  background(0);
}

function draw() {
  let h = Math.random() * 255;
  let s = Math.random() * 255;
  let b = Math.random() * 255;

  let random = Math.random() * 2;
  fill(h, s, b/4);
  translate(dimensions / 2, dimensions / 2);
  noStroke();
  rotate(PI*(random));
  rect(10, 10, 200);
}
