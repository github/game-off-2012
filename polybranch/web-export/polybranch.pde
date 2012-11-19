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
  size(500,500);
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
//create some kind of tree or branch object that takes in an initial triangle and a number of limbs
//function limb(PVector baseA, PVector baseB){}
class Branch{
  PVector[] verticies = new PVector[3];
  color col;
  Branch(PVector a, PVector b, PVector c, color colIn){
    verticies[0] = a;
    verticies[1] = b;
    verticies[2] = c;
    col = colIn;
  }
  
  public void render(PGraphics context){
    context.fill(col);
    context.noStroke();
    context.triangle(verticies[0].x, verticies[0].y,verticies[1].x, verticies[1].y,verticies[2].x, verticies[2].y);
  }
}
class Layer{
  int numSides;
  int startVertex;
  Tree tree;
  int layerWidth, layerHeight;
  int ringWeight = 6;
  PGraphics pg;
  float distance;
  
  Layer(int numSidesIn, int w, int h){
    numSides = numSidesIn;
    layerWidth = w;
    layerHeight = h;
    distance = 1;
    pg = createGraphics(layerWidth, layerHeight);

    startVertex = int(random(0, numSides));
    println(startVertex);
    
    
    float aX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*startVertex);
    float aY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*startVertex);
    float bX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*(startVertex-1));
    float bY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*(startVertex-1));
    
    pg.beginDraw();
    
    tree = new Tree(11, new Branch(
                new PVector(aX, aY),
                new PVector(bX, bY),
                new PVector(lerp(aX,layerWidth/2,0.7), lerp(aY,layerHeight/2,0.7)),
                color(random(50,100))),
                this.pg);
    drawPolygon(layerWidth/2, layerHeight/2, layerWidth/2 - ringWeight/2, 16, ringWeight,pg);
    pg.endDraw();
    
  }
  
  public void render(){
    fill(255,100);
    rect(width/2,height/2, layerWidth*distance, layerHeight*distance);
    image(pg, width/2, height/2, layerWidth*distance, layerHeight*distance);
  }

}
class Tree{
  Branch branches[];
  int index = 0;
  float trunkLen;
  PGraphics context;
  Tree(int numLimbs, Branch trunk, PGraphics contextIn){
    context = contextIn;
    branches = new Branch[numLimbs];
    branches[index] = trunk;
    index ++;
    trunkLen = dist(lerp(trunk.verticies[0].x, trunk.verticies[1].x, 0.5), lerp(trunk.verticies[0].y, trunk.verticies[1].y, 0.5), trunk.verticies[2].x, trunk.verticies[2].y);
    this.populateBranches(branches[0], (random(1)));
    this.render(context);
  }
  
  void populateBranches(Branch trunkIn, float sides){
      int side;
      if(sides > 0.2){
       side = 2; 
      }else{
        side = int(random(2));
      }
      
      if((side == 1 || side == 2) && index < branches.length){
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[0].x, trunkIn.verticies[0].y) * 0.7;
        
        if(len > 70){
       
        println(index);
        branches[index] = new Branch(
                  new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                  new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[1].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[1].y, 0.3)),
                  new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))),
                  color(random(50,100)));
                  index ++;
                  populateBranches(branches[index-1], (random(1)));
        }
                  
      }
      
      
      if((side == 0 || side == 2) && index < branches.length){
        
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[1].x, trunkIn.verticies[1].y) * 0.7;
        if(len > 70){
        println(index);
        branches[index] = new Branch(
                  new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[0].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[0].y, 0.3)),
                  new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                  new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))),
                  color(random(100,200)));
                  index ++;
                  populateBranches(branches[index-1], (random(1)));
        }
      }
      //if(index < branches.length){
//        if(side == 2){
//          populateBranches(branches[index-1], int(random(3)));
//          populateBranches(branches[index-2], int(random(3)));
//        }else{
//          populateBranches(branches[index-1], int(random(3)));
//        }
      //}

  }
  
  void render(PGraphics context){
    for(int i = 0; i < branches.length; i++){
      if(branches[i] != null){
        branches[i].render(context);
      }
    }
  }
}
class Game{
  ArrayList layers;
  String origin;
  Game(){
    origin = "I EXIST";
    layers = new ArrayList();
    //make 6 layers
    for(int i = 0; i < 6; i++){
      layers.add(new Layer(16, width, height));
    }
    //set the distance var for these 6 layers
    for(int i = layers.size(); i > 0; i--){
      Layer layer = (Layer) layers.get(i-1);
      println(1.0/(i));
      layer.distance = 1.0/(i);
    }
    
    println("game has "+layers.size());
  }
  
  public void update(){
  
  }
  
  public void display(){
    for(int i = layers.size() -1; i >= 0; i--){
      Layer layer = (Layer) layers.get(i);
      layer.render();
    }
  }
}

