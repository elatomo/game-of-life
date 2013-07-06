//  Processing.js example sketch
import Cell.pde;
import World.pde;

world = new World(
    floor(window.innerWidth/30),
    floor(window.innerHeight/30)
);

void setup() {
    size(window.innerWidth, window.innerHeight);
    stroke(0);
    fill(0);
    frameRate(10);
    //noLoop();
}

void draw() {
    // clean it up
    background(255);
    world.draw();
    world.update();
}
