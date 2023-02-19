/// <reference path="../_lib/p5.global-mode.d.ts" />

// CUSTOMIZABLE VARIABLES //
const canvas = 800; // canvas size
const colors = [[010, 90, 100],  // common
                [210, 90, 100],  // common
                [030, 40, 100],  // uncommon
                [260, 80, 100],  // rare
                [020, 60, 040],  // epic
                [140, 80, 080]]; // legendary
const precision = 10000; // int multiplier: makes random range higher
const i_weight = 1; // int multiplier: makes gradient come more from left
const j_weight = 1; // int multiplier: makes gradient come more from top
const rare_tweak = 1; // float multiplier: higher makes rarer colors more common
const random_shift = 0; // float added: random shift by random int value
const color_shift = 0; // int added: shifts color by this number 

const process_stats = true; // loop and display color appearance frequency
const color_test = true; // display the six colors

// type here to refresh: iiii

// STATS //
let total_color = 0;
let color_frequency = [0, 0, 0, 0, 0, 0];
let select_color = 0;

// FUNCTIONS //
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// INITIAL SETUP //
function setup() {
    createCanvas(canvas, canvas);
    colorMode(HSB);
}

// IMAGE DRAW //
function draw() {
    // IMAGE GENERATOR //
    background(0);
    for (let i = 1; i < 13; i++) {
        for (let j = 1; j < 13; j++) {
            // SQUARE GENERATION //
            select_color = Math.floor((i_weight * getRandomInt(precision * i) + j_weight * getRandomInt(precision * j)) * 6 / (precision * (i_weight * 13 + j_weight * 13)));
            if (color_shift || random_shift) {
                select_color = (select_color + getRandomInt(random_shift) + color_shift) % 6;
            }
            fill(colors[select_color]);
            noStroke();
            rect(50 + 50 * i, 50 + 50 * j, 50);

            // STATS //
            total_color++;
            color_frequency[select_color]++;
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

    // SIX COLORS TEST //
    if (color_test) {
        noStroke();
        fill(colors[0]);
        rect(400, 730, 50);
        noStroke();
        fill(colors[1]);
        rect(450, 730, 50);
        noStroke();
        fill(colors[2]);
        rect(500, 730, 50);
        noStroke();
        fill(colors[3]);
        rect(550, 730, 50);
        noStroke();
        fill(colors[4]);
        rect(600, 730, 50);
        noStroke();
        fill(colors[5]);
        rect(650, 730, 50);
        textSize(14.4);
        fill(255);
        text("Color0  Color1  Color2  Color3  Color4  Color5", 403, 795);
    }
}