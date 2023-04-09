function Agent(xpos, ypos, xvel, yvel){

    this.pos = new p5.Vector(xpos, ypos);
    this.vel = new p5.Vector(xvel, yvel);

    const wordSize = 24;
    const words = ['climate', 'AGW', 'gas', 'environment', 'USHCN', 'INDC', 'energ', 'temperature', 'carbon', 'pollution', 'co2', 'science', 'politics', 'health', 'Earth', 'emission', 'weather', 'fossil', 'fuel', 'sea-level rise', 'COP', 'UNFCCC', 'IPCC', 'PPM', 'methane', 'mitigation', 'warm', 'degre', 'cool', 'dioxid', 'barrel', 'oil', 'antarct', 'atmosphe', 'glacier', 'melt', 'antarctica', 'mediev', 'palaeo', 'turbin', 'renew', 'wind', 'megawatt', 'hydrogen', 'reactor', 'nuclear', 'green', 'cyclon', 'storm', 'hurrican', 'scheme', 'cultivar', 'endanger', 'coral', 'phytoplankton', 'ozon', 'extinct', 'bear', 'polar', 'vehicl', 'electric', 'car', 'millenni', 'adapt', 'mercuri', 'flood', 'cloud', 'ratif', 'treati', 'consensus', 'alarmist', 'develop', 'recycle', 'impact', 'conservation', 'forest', 'EPA', 'acid', 'species', 'simul', 'EIA', 'CLF', 'GHG', 'calcif', 'RGGI', 'NHTSA', 'MGP', 'NAAQ', 'NDVI', 'diseas', 'VMT', 'USHCN', 'integrity'];
    const wordIndex = int(random(words.length));
    const wordWidth = textWidth(words[wordIndex]);
    const wordHeight = textHeight(words[wordIndex]);
    var avoidRadius = wordWidth;
    console.log(wordHeight);

    textSize(wordSize);
    
    this.draw = function(){
        noStroke();
        //noFill();
        fill(20);
        rectMode(RADIUS);
        rect(this.pos.x, this.pos.y - wordSize * 0.4, wordWidth * 0.5, - wordSize * 0.6);
        fill(255);
        textAlign(CENTER);
        textFont(univers);
        text(words[wordIndex], this.pos.x, this.pos.y);
    }
    
    this.move = function(){
        this.pos.add(this.vel); // vector addition
        this.vel.mult(friction); // decelerate
        // wrap
        if (this.pos.x > width) this.pos.x = - wordWidth;
        if (this.pos.y > height + wordSize * 1.2) this.pos.y = 0;
        if (this.pos.x < - wordWidth) this.pos.x = width;
        if (this.pos.y < 0) this.pos.y = height + wordSize * 1.2;
    }
    
    this.avoid = function(){ // avoidance - don't get too close to your neighbours
        var avoidVec = createVector(); // vector to store avoidance force 
        for (var neighbour of swarm){ // run through the swarm
            var nd = this.pos.dist(neighbour.pos); // neighbour distance
            if (nd < avoidRadius && nd > 0){// ignore neighbours that are far away
                var pushVec = p5.Vector.sub(this.pos,neighbour.pos); // repulsive push away from close neighbours
                pushVec.normalize(); // scale to 1
                avoidVec.add(pushVec); // add this push to the total avoidance 
            } 
        }
        avoidVec.normalize(); //scale to 1.0
        avoidVec.mult(avoidStrength); // multiply by the strength variable
        this.vel.add(avoidVec); // add to velocity

    /*this.avoid = function() {
        var avoidVec = createVector(); // vector to store avoidance force 
        var thisRect = {
            x: this.pos.x,
            y: this.pos.y + wordSize * 0.2,
            w: wordWidth,
            h: - wordSize * 1.2
        }; // rectangle of this agent
        
        for (var neighbour of swarm) { // run through the swarm
            if (neighbour === this) continue; // ignore self
            var neighbourRect = {
                x: neighbour.pos.x,
                y: neighbour.pos.y + wordSize * 0.2,
                w: textWidth(neighbour.word),
                h: - wordSize * 1.2
            }; // rectangle of neighbour agent
            
            if (intersectRect(thisRect, neighbourRect)) { // if rectangles intersect
                var pushVec = createVector(this.pos.x - neighbour.pos.x, this.pos.y - neighbour.pos.y); // repulsive push away from close neighbours
                pushVec.normalize(); // scale to 1
                avoidVec.add(pushVec); // add this push to the total avoidance 
            }
        }
        
        avoidVec.normalize(); //scale to 1.0
        avoidVec.mult(avoidStrength); // multiply by the strength variable
        this.vel.add(avoidVec); // add to velocity*/
    }
}