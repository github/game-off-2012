PVector[] tris = {
      new PVector(200,200),
      new PVector(400,200),
      new PVector(0,100)
    };
    
//Branch bob = new Branch(
//                new PVector(200, 500),
//                new PVector(300, 500),
//                new PVector(250, 300),
//                color(random(100,200)));
      
int originX;
int originY;          
                
Tree testTree;

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
  g = new Game();
  g.display();
  Layer layer = new Layer(16, width, height);
}

void draw(){
  background(255);
  g.update();
}

//testtesttest
void mousePressed(){
  //background(255);
  //testTree = new Tree(15, bob);
  //Layer layer = new Layer(16, width, height);
  //Layer layer2 = new Layer(16, int(width*0.8), int(height*0.8));
  //layer2.render();
  //layer.render();
  
  //g = new Game();
  //g.display();
  println(frameRate);
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


void drawPolygon(float cX, float cY, float r, int numSides, float weight){
  float a = TWO_PI / numSides;
  noFill();
  stroke(0);
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
