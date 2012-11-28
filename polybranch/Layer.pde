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
                new PVector(lerp(aX,layerWidth/2,0.7), lerp(aY,layerHeight/2,0.7))));
    //drawPolygon(layerWidth/2, layerHeight/2, layerWidth/2 - ringWeight/2, 16, ringWeight, color(255,0,0,0.5));
    
  }
  
  public void updateDist(float increment){
    distance += increment;
//    if(easedDistance > 4){
//      reset();
//    }
    easedDistance = easeInExpo(distance, distance, 0,1,1);
    if(easedDistance > 0.95 && easedDistance < 1.05){
      tree.checkCollisions();
    }
    
  }
  
  public void reset(){
    distance = 0;
    easedDistance = 0;
    
    tree.reset();
  }
  
  public void render(){
    //fill(255,100);
    //rect(lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
    
    //image(pg, lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
    tree.render(lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), layerWidth*easedDistance, layerHeight*easedDistance, easedDistance);
    
    color c = (easedDistance > 1) ? color(0,0,255) : color(100);
    drawPolygon(lerp(width/2, originX, easedDistance), lerp(height/2, originY,easedDistance), (layerWidth*easedDistance)/2 - (ringWeight*easedDistance)/2, 16, ringWeight*easedDistance, c);
  }

}
