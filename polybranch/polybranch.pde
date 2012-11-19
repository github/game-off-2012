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
                
                
Tree testTree;

Game g;

PVector focalPoint;

void setup(){
  size(800,800);
  imageMode(CENTER);
  rectMode(CENTER);
  focalPoint = new PVector(width/2,height/2);
  noStroke();
  background(255);
  //testTree = new Tree(5, bob);
  g = new Game();
  g.display();
  Layer layer = new Layer(16, width, height);
}

void draw(){}

//testtesttest
void mousePressed(){
  println("boop!");
  background(255);
  //testTree = new Tree(15, bob);
  //Layer layer = new Layer(16, width, height);
  //Layer layer2 = new Layer(16, int(width*0.8), int(height*0.8));
  //layer2.render();
  //layer.render();
  
  g = new Game();
  g.display();
}


//utility functions!
float myAngleBetween (PVector myPVector1, PVector myPVector2) {
  float a = atan2(myPVector1.y-myPVector2.y, myPVector1.x-myPVector2.x);
  if (a<0) { a+=TWO_PI; }
  return a;
}


void drawPolygon(float cX, float cY, float r, int numSides, int weight, PGraphics context){
  float a = TWO_PI / numSides;
  context.noFill();
  context.stroke(0);
  context.strokeWeight(weight);
  context.beginShape();
  for(int i = 0; i < numSides; i++){
    context.vertex(cX + r * cos(a*i), cY + r * sin(a*i));
  }
  context.endShape(CLOSE);
}
