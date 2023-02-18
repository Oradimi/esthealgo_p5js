/// <reference path="../_lib/p5.global-mode.d.ts" />

// CUSTOMIZABLE VARIABLES //
const canvas = 800; // canvas size
const colors = [[010, 90, 100],  // most common
                [210, 90, 100],  // common
                [030, 40, 100],  // uncommon
                [260, 80, 100],  // rare
                [020, 60, 040],  // epic
                [140, 80, 080]]; // legendary
const i_weight = 1; // int multiplier: makes gradient come from left the higher
const j_weight = 1; // int multiplier: makes gradient come from top the higher
const random_shift = 0; // float added: random shift by random int value
const color_shift = 0; // int added: shifts color by this number 
const rare_tweak = 1; // float multiplier: higher makes rarer colors more common

// STATS //
let total_color = 0;
let color_frequency = [0, 0, 0, 0, 0, 0];
let select_color = 0;
let process_stats = false;

// type here to refresh: iii

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setup() {
    // INITIAL SETUP //
    createCanvas(canvas, canvas);
    colorMode(HSB);

    // IMAGE GENERATOR //
    /*background(0);
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {

            let tweaked_random = Math.floor((getRandomInt(i_weight * i) + getRandomInt(j_weight * j)) * rare_tweak * 6 / (11 * i_weight + 11 * j_weight - 2) + getRandomInt(random_shift) + color_shift);

            fill(colors[tweaked_random % 6]);
            noStroke();
            rect(100 + 50 * i, 100 + 50 * j, 50);
        }
    }*/

    // TEST DES SIX COULEURS //
    /*noStroke();
    fill(colors[0]);
    rect(100, 730, 50);
    noStroke();
    fill(colors[1]);
    rect(150, 730, 50);
    noStroke();
    fill(colors[2]);
    rect(200, 730, 50);
    noStroke();
    fill(colors[3]);
    rect(250, 730, 50);
    noStroke();
    fill(colors[4]);
    rect(300, 730, 50);
    noStroke();
    fill(colors[5]);
    rect(350, 730, 50);*/
}

function draw() {
    // IMAGE GENERATOR //
    background(0);
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {

            select_color = Math.floor((getRandomInt(i_weight * i) + getRandomInt(j_weight * j)) * rare_tweak * 6 / (11 * i_weight + 11 * j_weight - 2) + getRandomInt(random_shift) + color_shift) % 6;

            // STATS //
            total_color++;
            color_frequency[select_color]++;

            fill(colors[select_color]);
            noStroke();
            rect(100 + 50 * i, 100 + 50 * j, 50);
        }
    }
    // STATS DISPLAY //
    if (process_stats) {
        textSize(16);
        fill(255);
        text("Color0: " + color_frequency[0] / total_color * 100 + "%", 100, 720);
        text("Color1: " + color_frequency[1] / total_color * 100 + "%", 100, 735);
        text("Color2: " + color_frequency[2] / total_color * 100 + "%", 100, 750);
        text("Color3: " + color_frequency[3] / total_color * 100 + "%", 100, 765);
        text("Color4: " + color_frequency[4] / total_color * 100 + "%", 100, 780);
        text("Color5: " + color_frequency[5] / total_color * 100 + "%", 100, 795);

        loop();
    } else {
        noLoop();
    }
}