class Layer{
  int numSides;
  int startVertex;
  Tree tree;
  int layerWidth, layerHeight;
  int ringWeight = 6;
  PGraphics pg;
  float distance;
  float easedDistance;
  
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
  
  public void updateDist(float increment){
    distance += increment;
    
  }
  
  public void render(){
    fill(255,100);
    rect(lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
    image(pg, lerp(width/2, originX, easedDistance),lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
  }

}
