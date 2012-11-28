class Tree{
  Branch branches[];
  int numBranches;
  int index = 0;
  float trunkLen;
  Tree(int numBranchesIn, Branch trunk){
    numBranches = numBranchesIn;
    branches = new Branch[16];
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
      
      if((side == 1 || side == 2) && index < numBranches){
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[0].x, trunkIn.verticies[0].y) * 0.7;
        
        if(len > (trunkLen*0.4)){
          
          //check if the random angle will fit inside the circle
          if(dist((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle)),width/2,height/2) < width/2){
            //println(index);
            branches[index] = new Branch(
                      new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                      new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[1].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[1].y, 0.3)),
                      new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))));
                      index ++;
                      populateBranches(branches[index-1], (random(1)));
                //check if the min or max angle fit inside the area
          }else if(dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+HALF_PI)), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+HALF_PI)),width/2,height/2) < width/2 || 
                      dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0]))), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0]))),width/2,height/2) < width/2){
            populateBranches(trunkIn, 1);
          }//otherwise don't do it.
        
        }
                  
      }
      
      
      if((side == 0 || side == 2) && index < numBranches){
        
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[1].x, trunkIn.verticies[1].y) * 0.7;
        if(len > (trunkLen*0.4)){
          
          //check if the random angle will fit inside the circle
          if(dist((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle)),width/2,height/2) < width/2){
            //println(index);
            branches[index] = new Branch(
                      new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[0].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[0].y, 0.3)),
                      new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y),
                      new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))));
                      index ++;
                      populateBranches(branches[index-1], (random(1)));
          }else if(dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-HALF_PI)), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-HALF_PI)), width/2, height/2) < width / 2 ||
                    dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1]))), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1]))), width/2, height/2) < width / 2){
            populateBranches(trunkIn, 0);
          }
        
        }
      }
      //if(index < numBranches){
//        if(side == 2){
//          populateBranches(branches[index-1], int(random(3)));
//          populateBranches(branches[index-2], int(random(3)));
//        }else{
//          populateBranches(branches[index-1], int(random(3)));
//        }
      //}

  }
  
  void checkCollisions(){
    for(int i = 0; i < numBranches; i++){
      if(branches[i] != null){
        //branches[i].render(context);
        branches[i].playerOverlap();
      }
    }
  }
  
  void render(float oX, float oY, float w, float h, float easedDist){
    for(int i = 0; i < numBranches; i++){
      if(branches[i] != null){
        //branches[i].render(context);
        branches[i].setPos(oX, oY, w, h, easedDist);
        branches[i].render(oX, oY, w, h, easedDist);
      }
    }
  }
}
