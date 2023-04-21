let walls;

function Water(level){
    this.level = level;
    this.height = 300;
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
    const words_bad = ['AGW', 'gas', 'temperature', 'carbon', 'pollution', 'co2', 'emission', 'fossil', 'fuel', 'sea-level rise', 'methane', 'dioxid', 'oil', 'melt', 'cyclon', 'storm', 'hurrican', 'endanger', 'extinct', 'vehicl', 'car', 'flood', 'ratif', 'impact', 'acid', 'simul', 'GHG', 'diseas', 'energ', 'weather', 'warm', 'cool', 'barrel', 'degre', 'turbin', 'wind', 'megawatt', 'reactor'];
    const words_good = ['health', 'Earth', 'mitigation', 'nuclear', 'renew', 'hydrogen', 'green', 'scheme', 'cultivar', 'phytoplankton', 'electric', 'consensus', 'alarmist', 'develop', 'recycle', 'conservation', 'integrity', 'forest', 'bear', 'science', 'atmosphe', 'glacier', 'antarctica', 'species', 'antarct', 'environment', 'coral', 'ozon', 'polar', 'millenni', 'cloud'];
    const words_actions = ['climate', 'USHCN', 'politics', 'PPM', 'mediev', 'palaeo', 'mercuri', 'treati', 'calcif', 'VMT', 'INDC', 'COP', 'UNFCCC', 'IPCC', 'adapt', 'EPA', 'CLF', 'EIA', 'RGGI', 'NHTSA', 'NAAQ', 'MGP', 'NDVI', 'USHCN'];
    switch (type) {
        case 0:
            words = words_actions;
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
    this.wordIndex = int(random(words.length));
    textFont(univers);
    this.wordWidth = textWidth(words[this.wordIndex]);
    this.wordSize = 24 * (300 + this.health) / 1000;
    //const wordHeight = textHeight(words[wordIndex]);
    var avoidRadius = 100;
    
    this.draw = function(){
        noStroke();
        //noFill();
        //fill(20);

        /* HITBOX DISPLAY */
        /*rectMode(CORNERS);
        fill(40);
        rect(this.pos.x - this.wordWidth,
            this.pos.y - this.wordSize * 0.8,
            this.pos.x + this.wordWidth,
            this.pos.y + this.wordSize * 0.2);*/

        //rect(this.pos.x, this.pos.y - this.wordSize * 0.4, wordWidth * 0.5, - this.wordSize * 0.6); 
        //fill(255);
        //circle(this.pos.x, this.pos.y, 10);
        //strokeWeight(2);
        fill(color);
        stroke(color);
        textAlign(CENTER);
        textFont(univers);
        this.wordSize = 24 * (300 + this.health) / 1000;
        textSize(this.wordSize);
        text(words[this.wordIndex], this.pos.x, this.pos.y);
    }
    
    this.move = function(){
        this.pos.add(this.vel); // vector addition
        this.vel.mult(friction); // decelerate
        // wrap
        if (this.pos.x > width + this.wordWidth) this.pos.x = - this.wordWidth;
        if (this.pos.y > height) {
            this.pos.y = height - 2;
            this.vel.y = - this.vel.y;
        };
        if (this.pos.x < - this.wordWidth) this.pos.x = width + this.wordWidth;
        if (this.pos.y < 0) {
            this.pos.y = 0 + 2;
            this.vel.y = - this.vel.y;
        };
    }

    this.avoid = function() {
        //var avoidVec = createVector(); // vector to store avoidance force
        /*var thisRect = {
            x: this.pos.x,
            y: this.pos.y + this.wordSize * 0.2,
            w: wordWidth,
            h: - this.wordSize * 1.2
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
                if (nd > avoidRadius){
                    var pushVec = p5.Vector.sub(neighbour.pos, this.pos);
                    pushVec.normalize();
                    avoidVec.add(pushVec);
                }
            } else if (friend) {
                if (nd > avoidRadius * 3){ 
                    var pushVec = p5.Vector.sub(neighbour.pos, this.pos);
                    pushVec.normalize();
                    avoidVec.add(pushVec);
                }
                if (nd < avoidRadius && nd > 0){// ignore neighbours that are far away
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
                if (nd < avoidRadius / 3 && nd > 0){// ignore neighbours that are far away
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec * 3); // add this push to the total avoidance 
                }
                if (nd < avoidRadius / 4 && nd > 0){// ignore neighbours that are far away
                    this.health += - neighbour.health / 3000; // make it smaller
                }
            } else {
                if (nd < avoidRadius && nd > 0){// ignore neighbours that are far away
                    var pushVec = p5.Vector.sub(this.pos, neighbour.pos); // repulsive push away from close neighbours
                    pushVec.normalize(); // scale to 1
                    avoidVec.add(pushVec); // add this push to the total avoidance 
                }
                if (nd < avoidRadius / 2 && nd > 0){// ignore neighbours that are far away
                    this.health += - neighbour.health / 500; // make it smaller
                }
            }
        }
        avoidVec.normalize(); //scale to 1.0
        avoidVec.mult(avoidStrength); // multiply by the strength variable
        this.vel.add(avoidVec); // add to velocity
    }
}