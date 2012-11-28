PVector[] tris = {
      new PVector(200,200),
      new PVector(400,200),
      new PVector(0,100)
    };
    
boolean[] keys = new boolean[4];
      
int originX;
int originY;
                
Tree testTree;

Player player;
Game g;

PVector focalPoint;

void setup(){
  size(800,800);
  //frameRate(30);
  originX = width/2;
  originY = height/2;
  
  
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  focalPoint = new PVector(width/2,height/2);
  noStroke();
  background(255);
  //testTree = new Tree(5, bob);
  
  player = new Player();
  g = new Game();
  Layer layer = new Layer(16, width, height);
}

void draw(){
  if(keys[0]){
    originY += player.speed;
  }
  if(keys[1]){
    originY -= player.speed;
  }
  if(keys[2]){
    originX += player.speed;
  }
  if(keys[3]){
    originX -= player.speed;
  }
  if(dist(player.pos.x, player.pos.y, originX, originY) > (height/2 - player.r - 8)){
    float a = myAngleBetween(player.pos, new PVector(originX, originY))-PI;
    originX = (int)(player.pos.x + (height/2 - player.r - 8) * cos(a));
    originY = (int)(player.pos.y + (height/2 - player.r - 8) * sin(a));
  }
  
  background(255);
  g.update();  
}


//testtesttest
void mousePressed(){
 player.speed++;
}

void keyPressed(){
  if (keyCode == UP || key == 'w' || key == 'W') {
    keys[0] = true;
  }
  if (keyCode == DOWN || key == 's' || key == 'S') {
    keys[1] = true;
  }
  if (keyCode == LEFT || key == 'a' || key == 'A') {
    keys[2] = true;
  }
  if (keyCode == RIGHT || key == 'd' || key == 'D') {
    keys[3] = true;
  }
}

void keyReleased(){
  if (keyCode == UP || key == 'w' || key == 'W') {
    keys[0] = false;
  }
  if (keyCode == DOWN || key == 's' || key == 'S') {
    keys[1] = false;
  }
  if (keyCode == LEFT || key == 'a' || key == 'A') {
    keys[2] = false;
  }
  if (keyCode == RIGHT || key == 'd' || key == 'D') {
    keys[3] = false;
  }
}

void mouseMoved(){
  originX = mouseX;
  originY = mouseY;
  //if(dist(int(mouseX),int(mouseY), int(width/2), int(height/2)) < width/2){
    
  //}
}


//utility functions!
float myAngleBetween (PVector myPVector1, PVector myPVector2) {
  float a = atan2(myPVector1.y-myPVector2.y, myPVector1.x-myPVector2.x);
  if (a<0) { a+=TWO_PI; }
  return a;
}


void drawPolygon(float cX, float cY, float r, int numSides, float weight, color cIn){
  float a = TWO_PI / numSides;
  noFill();
  stroke(cIn);
  strokeWeight(weight);
  beginShape();
  for(int i = 0; i < numSides; i++){
    vertex(cX + r * cos(a*i), cY + r * sin(a*i));
  }
  endShape(CLOSE);
}

float easeInExpo(float x, float t, float b, float c, float d) {
  return (t==0) ? b : c * pow(2, 10 * (t/d - 1)) + b;
}
