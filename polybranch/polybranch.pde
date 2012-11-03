PVector[] tris = {
      new PVector(200,200),
      new PVector(400,200),
      new PVector(0,100)
    };
    
Branch bob = new Branch(
                new PVector(200, 500),
                new PVector(300, 500),
                new PVector(250, 300),
                color(random(100,200)));
                
Tree testTree;

void setup(){
  size(500,500);
  noStroke();
  background(255);
  testTree = new Tree(5, bob);
}

void draw(){}

class Tree{
  Branch branches[];
  int index = 0;
  float trunkLen;
  Tree(int numLimbs, Branch trunk){
    branches = new Branch[numLimbs];
    branches[index] = trunk;
    index ++;
    trunkLen = dist(lerp(trunk.verticies[0].x, trunk.verticies[1].x, 0.5), lerp(trunk.verticies[0].y, trunk.verticies[1].y, 0.5), trunk.verticies[2].x, trunk.verticies[2].y);
    println(trunkLen);
    this.populateBranches(branches[0], (random(1)));
    this.render();
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
        
        if(len > 100){
       
        println(index);
        branches[index] = new Branch(
                  new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                  new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[1].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[1].y, 0.3)),
                  new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))),
                  color(random(100,200)));
                  index ++;
                  populateBranches(branches[index-1], (random(1)));
        }
                  
      }
      
      
      if((side == 0 || side == 2) && index < branches.length){
        
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[1].x, trunkIn.verticies[1].y) * 0.7;
        if(len > 100){
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
  
  void render(){
    for(int i = 0; i < branches.length; i++){
      if(branches[i] != null){
        branches[i].render();
      }
    }
  }
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
  
  public void render(){
    fill(col);
    triangle(verticies[0].x, verticies[0].y,verticies[1].x, verticies[1].y,verticies[2].x, verticies[2].y);
  }
}


//utility functions!
float myAngleBetween (PVector myPVector1, PVector myPVector2) {
  float a = atan2(myPVector1.y-myPVector2.y, myPVector1.x-myPVector2.x);
  if (a<0) { a+=TWO_PI; }
  return a;
}

void mousePressed(){
  println("boop!");
  background(255);
  testTree = new Tree(7, bob);
}
