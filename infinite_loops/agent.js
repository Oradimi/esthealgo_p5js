let walls;

function Water(level){
    this.level = level;
    this.height = 200;
    this.margin = 30;
    this.speed = 0;
    this.color = 90;
    this.waveOffset = 0;
    this.waveSpeed = 0.05;
    this.waveHeight = 10;
    this.animation = false;

    /*this.startRising = function(){
        this.animation = true;
    }*/
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Agent(xpos, ypos, xvel, yvel, type, color, health){

    this.pos = new p5.Vector(xpos, ypos);
    this.vel = new p5.Vector(xvel, yvel);
    this.type = type;
    this.color = color;
    this.health = health;

    let words;
    let wordSize;

    const words_bad = ['AGW', 'gas', 'temperature', 'carbon', 'pollution', 'co2', 'emission', 'fossil', 'fuel', 'sea-level rise', 'methane', 'dioxid', 'oil', 'melt', 'cyclon', 'storm', 'hurrican', 'endanger', 'extinct', 'vehicl', 'car', 'flood', 'ratif', 'impact', 'acid', 'simul', 'GHG', 'diseas'];
    const words_good = ['health', 'Earth', 'INDC','COP', 'UNFCCC', 'IPCC', 'mitigation', 'nuclear','renew','hydrogen', 'green', 'scheme', 'cultivar', 'phytoplankton','electric','adapt', 'consensus', 'alarmist', 'develop',  'recycle', 'conservation', 'EPA', 'CLF', 'EIA', 'RGGI', 'NHTSA', 'NAAQ', 'MGP', 'NDVI', 'USHCN', 'integrity']
    const words_neutral = ['climate', 'USHCN', 'energ', 'science', 'weather',  'politics', 'PPM','warm', 'degre', 'cool', 'barrel','atmosphe', 'glacier', 'antarct', 'antarctica', 'mediev','environment', 'palaeo', 'turbin', 'wind', 'megawatt', 'reactor', 'coral', 'ozon', 'bear', 'polar', 'millenni', 'mercuri',  'cloud','treati', 'forest', 'species', 'calcif', 'VMT']
    switch (type) {
        case 0:
            words = words_neutral;
            break;
        case 1:
            words = words_good;
            break;
        case 2:
            words = words_bad;
            break;
        default:
            break;
    }
    const wordIndex = int(random(words.length));
    const wordWidth = textWidth(words[wordIndex]);
    //const wordHeight = textHeight(words[wordIndex]);
    var avoidRadius = 100;
    
    this.draw = function(){
        noStroke();
        //noFill();
        //fill(20);
        //rectMode(RADIUS);
        //rect(this.pos.x, this.pos.y - wordSize * 0.4, wordWidth * 0.5, - wordSize * 0.6); 
        //fill(255);
        //circle(this.pos.x, this.pos.y, 10);
        //strokeWeight(2);
        fill(color);
        stroke(color);
        textAlign(CENTER);
        textFont(univers);
        wordSize = 24 * (300 + this.health) / 1000;
        textSize(wordSize);
        text(words[wordIndex], this.pos.x, this.pos.y);
    }
    
    this.move = function(){
        this.pos.add(this.vel); // vector addition
        this.vel.mult(friction); // decelerate
        // wrap
        if (this.pos.x > width + wordWidth) this.pos.x = - wordWidth;
        if (this.pos.y > height) {
            this.pos.y = height - 2;
            this.vel.y = - this.vel.y;
        };
        if (this.pos.x < - wordWidth) this.pos.x = width + wordWidth;
        if (this.pos.y < water.level) {
            this.pos.y = water.level + 2;
            this.vel.y = - this.vel.y;
        };
    }

    this.avoid = function() {
        //var avoidVec = createVector(); // vector to store avoidance force
        /*var thisRect = {
            x: this.pos.x,
            y: this.pos.y + wordSize * 0.2,
            w: wordWidth,
            h: - wordSize * 1.2
        }; // rectangle of this agent*/
        
        var avoidVec = createVector(); // vector to store avoidance force 
        for (var neighbour of swarm){ // run through the swarm
            var nd = this.pos.dist(neighbour.pos); // neighbour distance
            let friend = (neighbour.type == this.type);
            if (this.type == 0) {
                if (nd < avoidRadius && nd > 0){// ignore neighbours that are far away
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
            } else if (neighbour.type == 0) {
                if (nd > avoidRadius){// ignore neighbours that are far away 
                    var pushVec = p5.Vector.sub(neighbour.pos, this.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
            } else if (friend) {
                if (nd > avoidRadius){// ignore neighbours that are far away 
                    var pushVec = p5.Vector.sub(neighbour.pos, this.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
                if (nd < avoidRadius && nd > 0){// ignore neighbours that are far away
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
            } else {
                if (nd < avoidRadius * 3 && nd > 0){// ignore neighbours that are far away
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
                if (nd < avoidRadius / 2 && nd > 0){// ignore neighbours that are far away
                    this.health += - neighbour.health / 500;
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
            }
        }
        avoidVec.normalize(); //scale to 1.0
        avoidVec.mult(avoidStrength); // multiply by the strength variable
        this.vel.add(avoidVec); // add to velocity
    }
}