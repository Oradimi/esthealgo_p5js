/// <reference path="../_lib/p5.global-mode.d.ts" />

let box_size = 400;

function setup() {
    createCanvas(800, 800, WEBGL);
    angleMode(DEGREES);
    background(0);
}

function draw() {
    //translate(0, 0, 0);
    normalMaterial();
    //push();
    rotateZ(360 * sin(frameCount * 1));
    rotateX(360 * sin(frameCount * 1));
    rotateY(360 * sin(frameCount * 1));
    box(box_size, box_size, box_size);
    box_size = box_size - frameCount * 0.0001;
    if (box_size < 0) {
        box_size = 0;
        noLoop();
        save();
    }
    //pop();
}