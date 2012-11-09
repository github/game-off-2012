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
                  color(random(100,200)));
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
