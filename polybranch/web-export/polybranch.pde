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
  
  public void render(float oX, float oY, float w, float h, float easedDist){
      fill(col);
      noStroke();
      triangle(verticies[0].x*easedDist+(oX-(w)/2), verticies[0].y*easedDist+(oY-h/2),
                verticies[1].x*easedDist+(oX-(w)/2), verticies[1].y*easedDist+(oY-h/2),
                verticies[2].x*easedDist+(oX-(w)/2), verticies[2].y*easedDist+(oY-h/2));
  }
}
class Layer{
  int numSides;
  int startVertex;
  Tree tree;
  int layerWidth, layerHeight;
  int ringWeight = 6;
  float distance;
  float easedDistance;
  
  Layer(int numSidesIn, int w, int h){
    numSides = numSidesIn;
    layerWidth = w;
    layerHeight = h;
    distance = 1;

    startVertex = int(random(0, numSides));
    
    
    float aX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*startVertex);
    float aY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*startVertex);
    float bX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*(startVertex-1));
    float bY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*(startVertex-1));
    
    
    tree = new Tree(11, new Branch(
                new PVector(aX, aY),
                new PVector(bX, bY),
                new PVector(lerp(aX,layerWidth/2,0.7), lerp(aY,layerHeight/2,0.7)),
                color(random(50,100))));
    drawPolygon(layerWidth/2, layerHeight/2, layerWidth/2 - ringWeight/2, 16, ringWeight);
    
  }
  
  public void updateDist(float increment){
    distance += increment;
//    if(easedDistance > 4){
//      reset();
//    }
    easedDistance = easeInExpo(distance, distance, 0,1,1);
    
  }
  
  public void reset(){
    distance = 0;
    easedDistance = 0;
  }
  
  public void render(){
    //fill(255,100);
    //rect(lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
    
    //image(pg, lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
    tree.render(lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), layerWidth*easedDistance, layerHeight*easedDistance, easedDistance);
    drawPolygon(lerp(width/2, originX, easedDistance), lerp(height/2, originY,easedDistance), (layerWidth*easedDistance)/2 - (ringWeight*easedDistance)/2, 16, ringWeight*easedDistance);
  }

}
class Tree{
  Branch branches[];
  int index = 0;
  float trunkLen;
  Tree(int numLimbs, Branch trunk){
    branches = new Branch[numLimbs];
    branches[index] = trunk;
    index ++;
    trunkLen = dist(lerp(trunk.verticies[0].x, trunk.verticies[1].x, 0.5), lerp(trunk.verticies[0].y, trunk.verticies[1].y, 0.5), trunk.verticies[2].x, trunk.verticies[2].y);
    this.populateBranches(branches[0], (random(1)));
    //this.render(context);
    //println("trunks is "+trunkLen);
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
        
        if(len > (trunkLen*0.4)){
          
          //check if the random angle will fit inside the circle
          if(dist((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle)),width/2,height/2) < width/2){
            //println(index);
            branches[index] = new Branch(
                      new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                      new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[1].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[1].y, 0.3)),
                      new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))),
                      color(random(50,100)));
                      index ++;
                      populateBranches(branches[index-1], (random(1)));
                //check if the min or max angle fit inside the area
          }else if(dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+HALF_PI)), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+HALF_PI)),width/2,height/2) < width/2 || 
                      dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0]))), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0]))),width/2,height/2) < width/2){
            populateBranches(trunkIn, 1);
          }//otherwise don't do it.
        
        }
                  
      }
      
      
      if((side == 0 || side == 2) && index < branches.length){
        
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[1].x, trunkIn.verticies[1].y) * 0.7;
        if(len > (trunkLen*0.4)){
          
          //check if the random angle will fit inside the circle
          if(dist((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle)),width/2,height/2) < width/2){
            //println(index);
            branches[index] = new Branch(
                      new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[0].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[0].y, 0.3)),
                      new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                      new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))),
                      color(random(100,200)));
                      index ++;
                      populateBranches(branches[index-1], (random(1)));
          }else if(dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-HALF_PI)), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-HALF_PI)), width/2, height/2) < width / 2 ||
                    dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1]))), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1]))), width/2, height/2) < width / 2){
            populateBranches(trunkIn, 0);
          }
        
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
  
  void render(float oX, float oY, float w, float h, float easedDist){
    for(int i = 0; i < branches.length; i++){
      if(branches[i] != null){
        //branches[i].render(context);
        branches[i].render(oX, oY, w, h, easedDist);
      }
    }
  }
}
class Game{
  ArrayList layers;
  String origin;
  
  
  float speed;

  Game(){
    origin = "I EXIST";
    layers = new ArrayList();
   
    speed = 0.003;
    
    //make 6 layers
    for(int i = 0; i < 12; i++){
      layers.add(new Layer(16, width, height));
    }
    //set the distance var for these 6 layers
    for(int i = layers.size(); i > 0; i--){
      Layer layer = (Layer) layers.get(i-1);
      //println(1.0/(i));
      layer.distance = 1.2/layers.size()*i;
      layer.easedDistance = easeInExpo(layer.distance, layer.distance, 0,1,1);
    }
    
    //println("game has "+layers.size());
  }
  
  public void update(){
    for(int i = 0; i < layers.size(); i++){
      Layer layer = (Layer) layers.get(i);
      if(layer.easedDistance > 4 && i == layers.size()-1){
        layers.add(0, layer);
        layers.remove(layers.size()-1);
        layer.reset();
      }else{
        layer.updateDist(speed);
        layer.render();
      }
    }
  }
  
  public void display(){
    for(int i = 0; i < layers.size(); i++){
      Layer layer = (Layer) layers.get(i);
      layer.render();
    }
  }
}

