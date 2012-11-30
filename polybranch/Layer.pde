class Layer {
  public int numSides;
  int startVertex;
  Tree tree;
  int layerWidth, layerHeight;
  int ringWeight = 6;
  float distance;
  float easedDistance;
  boolean passed = false;
  String type; //active, inactive, level

  Layer(int numSidesIn, int w, int h, String typeIn) {
    numSides = numSidesIn;
    layerWidth = w;
    layerHeight = h;
    distance = 1;
    type = typeIn;

    if (type == "active") {
      startVertex = int(random(0, numSides));

      float aX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*startVertex);
      float aY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*startVertex);
      float bX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*(startVertex-1));
      float bY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*(startVertex-1));

      tree = new Tree(11, new Branch(
      new PVector(aX, aY), 
      new PVector(bX, bY), 
      new PVector(lerp(aX, layerWidth/2, 0.7), lerp(aY, layerHeight/2, 0.7))));
    }
    else {
      tree = new Tree();
    }



    //drawPolygon(layerWidth/2, layerHeight/2, layerWidth/2 - ringWeight/2, numSides, ringWeight, color(255,0,0,0.5));
  }

  public void updateDist(float increment) {
    distance += increment;
    //    if(easedDistance > 4){
    //      reset();
    //    }
    easedDistance = easeInExpo(distance, distance, 0, 1, 1);
    if (easedDistance >= map(g.speed, 0.0025, 0.008, 0.999, 0.9) && easedDistance <= map(g.speed, 0.0025, 0.008, 1.02, 1.04)) {
      if(type == "active"){
        tree.checkCollisions();
      }else if(type == "level"){
        if(g.speed != g.speeds[g.level-1]){
          g.speed = g.speeds[g.level-1];
        }
      }
      
    }else if (easedDistance > 1 && !passed && type == "active") {
      passed = true;
      g.score += 100;
    }
  }

  public int getNumSides() { 
    return numSides;
  }

  public void reset(String typeIn) {
    type = typeIn;
    distance = 0;
    easedDistance = 0;
    passed = false;
    tree.reset();
  }

  public void render() {
    //fill(255,100);
    //rect(lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);

    //image(pg, lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
    if (type == "active") {
      tree.render(lerp(width/2, originX, easedDistance), lerp(height/2, originY, easedDistance), layerWidth*easedDistance, layerHeight*easedDistance, easedDistance);
    }
    else if (type == "level") {
      if (easedDistance < 0.8) {
        fill(map(easedDistance, 0.0, 0.8, 255, 100));
      }
      else {
        int alph = (easedDistance > 2) ? (int)map(easedDistance, 2, 8, 255, 0) : 255;
        fill(100,alph);
      }
      //text("Level "+g.level, lerp(width/2, originX, easedDistance), lerp(height/2, originY, easedDistance));
      noStroke();
      shape(levelText[(g.level-2)], lerp(width/2, originX, easedDistance), lerp(height/2, originY, easedDistance), levelText[(g.level-2)].width*easedDistance, levelText[(g.level-2)].height*easedDistance);
    }

    //color c = (easedDistance > 1) ? color(0,0,255) : color(100);
    color c = color(100);
    drawPolygon(lerp(width/2, originX, easedDistance), lerp(height/2, originY, easedDistance), (layerWidth*easedDistance)/2 - (ringWeight*easedDistance)/2, numSides, ringWeight*easedDistance, c);
  }


  //
  class Tree {
    Branch branches[];
    int numBranches;
    int index = 0;
    float trunkLen;
    Tree(int numBranchesIn, Branch trunk) {
      numBranches = numBranchesIn;
      branches = new Branch[16];
      println(numSides);
      for (int i = 0; i < branches.length; i++) {
        branches[i] = new Branch();
      }

      branches[index] = trunk;
      index ++;
      trunkLen = dist(lerp(trunk.verticies[0].x, trunk.verticies[1].x, 0.5), lerp(trunk.verticies[0].y, trunk.verticies[1].y, 0.5), trunk.verticies[2].x, trunk.verticies[2].y);
      this.populateRandomBranches(branches[0], (random(1)));
      //println("trunks is "+trunkLen);
    }

    Tree() {
      numBranches = 0;
      branches = new Branch[16];
      for (int i = 0; i < branches.length; i++) {
        branches[i] = new Branch();
      }
    }

    void populateRandomBranches(Branch trunkIn, float sides) {
      int side;
      if (sides > 0.2) {
        side = 2;
      }
      else {
        side = int(random(2));
      }

      if ((side == 1 || side == 2) && index < numBranches) {
        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[0].x, trunkIn.verticies[0].y) * 0.7;

        if (len > (trunkLen*0.4)) {

          //check if the random angle will fit inside the circle
          if (dist((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle)), width/2, height/2) < width/2) {
            //println(index);
            branches[index] = new Branch(
            new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y), 
            new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[1].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[1].y, 0.3)), 
            new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))));
            index ++;
            populateRandomBranches(branches[index-1], (random(1)));
            //check if the min or max angle fit inside the area
          }
          else if (dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+HALF_PI)), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0])+HALF_PI)), width/2, height/2) < width/2 || 
            dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0]))), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[0]))), width/2, height/2) < width/2) {
            populateRandomBranches(trunkIn, 1);
          }//otherwise don't do it.
        }
      }


      if ((side == 0 || side == 2) && index < numBranches) {

        float angle = myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-random(HALF_PI);
        float len = dist(trunkIn.verticies[2].x, trunkIn.verticies[2].y, trunkIn.verticies[1].x, trunkIn.verticies[1].y) * 0.7;
        if (len > (trunkLen*0.4)) {

          //check if the random angle will fit inside the circle
          if (dist((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle)), width/2, height/2) < width/2) {
            //println(index);
            branches[index] = new Branch(
            new PVector(lerp(trunkIn.verticies[2].x, trunkIn.verticies[0].x, 0.3), lerp(trunkIn.verticies[2].y, trunkIn.verticies[0].y, 0.3)), 
            new PVector(trunkIn.verticies[2].x, trunkIn.verticies[2].y), 
            new PVector((trunkIn.verticies[2].x + len * cos(angle)), (trunkIn.verticies[2].y + len * sin(angle))));
            index ++;
            populateRandomBranches(branches[index-1], (random(1)));
          }
          else if (dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-HALF_PI)), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1])-HALF_PI)), width/2, height/2) < width / 2 ||
            dist((trunkIn.verticies[2].x + len * cos(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1]))), (trunkIn.verticies[2].y + len * sin(myAngleBetween(trunkIn.verticies[2], trunkIn.verticies[1]))), width/2, height/2) < width / 2) {
            populateRandomBranches(trunkIn, 0);
          }
        }
      }
      //if(index < numBranches){
      //        if(side == 2){
      //          populateRandomBranches(branches[index-1], int(random(3)));
      //          populateRandomBranches(branches[index-2], int(random(3)));
      //        }else{
      //          populateRandomBranches(branches[index-1], int(random(3)));
      //        }
      //}
    }

    void reset() {
      index = 1;
      numBranches = g.numBranches;
      for (int i = 1; i < numBranches; i++) {
        branches[i].br = (int)random(50, 200);
        branches[i].verticies[0].x = 0;
        branches[i].verticies[0].y = 0;
      }

      startVertex = int(random(0, numSides));


      float aX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*startVertex);
      float aY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*startVertex);
      float bX = (layerWidth/2) + (layerWidth/2 - ringWeight/2) * cos((TWO_PI/numSides)*(startVertex-1));
      float bY = (layerHeight/2) + (layerHeight/2 - ringWeight/2) * sin((TWO_PI/numSides)*(startVertex-1));

      branches[0] = new Branch(
      new PVector(aX, aY), 
      new PVector(bX, bY), 
      new PVector(lerp(aX, width/2, 0.7), lerp(aY, width/2, 0.7)));
      trunkLen = dist(lerp(branches[0].verticies[0].x, branches[0].verticies[1].x, 0.5), lerp(branches[0].verticies[0].y, branches[0].verticies[1].y, 0.5), branches[0].verticies[2].x, branches[0].verticies[2].y);
      populateRandomBranches(branches[0], 2);
    }

    void checkCollisions() {
      for (int i = 0; i < numBranches; i++) {
        if (branches[i].verticies[0].x != 0 && branches[i].verticies[0].y != 0) {
          //branches[i].render(context);
          branches[i].playerOverlap();
        }
      }
    }

    void render(float oX, float oY, float w, float h, float easedDist) {
      for (int i = 0; i < numBranches; i++) {
        if (branches[i].verticies[0].x != 0 && branches[i].verticies[0].y != 0) {
          //branches[i].render(context);
          branches[i].setPos(oX, oY, w, h, easedDist);
          branches[i].render(oX, oY, w, h, easedDist);
        }
      }
    }
  }
}

