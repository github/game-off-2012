class Game{
  ArrayList layers;
  String origin;
  boolean drawnPlayer;
  int score;
  int level;
  
  int numBranches;
  
  String state; //"notPlaying" "playing" "paused"
  
  float speed;

  Game(){
    score = 0;
    origin = "I EXIST";
    layers = new ArrayList();
    
    drawnPlayer = false;
    
    numBranches = 6;
    level = 1;
    speed = 0.0025;
    
    //make 6 layers
    for(int i = 0; i < 13; i++){
      layers.add(new Layer(16, width, height));
    }
    //set the distance var for these 6 layers
    for(int i = layers.size(); i > 0; i--){
      Layer layer = (Layer) layers.get(i-1);
      //println(1.0/(i));
      layer.distance = 1.3/layers.size()*i;
      layer.easedDistance = easeInExpo(layer.distance, layer.distance, 0,1,1);
      //println(easeInExpo(1.3, 1.3, 0,1,1));
    }
    
    //println("game has "+layers.size());
  }
  
  
  public void update(){
    drawnPlayer = false;
    
    for(int i = 0; i < layers.size(); i++){
      Layer layer = (Layer) layers.get(i);
      if(layer.easedDistance > 8 && i == layers.size()-1){
        layers.add(0, layer);
        layers.remove(layers.size()-1);
        checkLevel();
        layer.reset();
        
      }else{
        layer.updateDist(speed);
        if(layer.easedDistance >= 1 && !drawnPlayer){
          noStroke();
          fill(50,255);
          ellipse(width/2,height/2,player.r*2,player.r*2);
          drawPolygon(lerp(width/2, originX, 1), lerp(height/2, originY,1), width/2, 16, 6, color(0,0,0));
          drawnPlayer = true;
        }
        layer.render();
      }
    }
  }
  
  void checkLevel(){
    if(score > 18000){
      level = 8;
      numBranches = 13;
      //speed = 0.004;
    }else if(score > 12000){
      level = 7;
      numBranches = 12;
      //speed = 0.004;
    }else if(score > 8000){
      level = 6;
      numBranches = 11;
      //speed = 0.004;
    }else if(score > 5000){
      level = 5;
      numBranches = 10;
      //speed = 0.004;
    }else if(score > 3000){
      level = 4;
      numBranches = 9;
      //speed = 0.004;
    }else if(score > 1500){
      level = 3;
      numBranches = 8;
      //speed = 0.0035;
    }else if(score > 500){
      level = 2;
      numBranches = 7;
      //speed = 0.003;
    }else{
      level = 1;
      numBranches = 6;
      //speed = 0.0025;
    }
    
    if(score < 30000){
      speed = map(score, 0,30000, 0.0025,0.009);
    }
  }
  
  public void gameOver(){
    noLoop();
  }
  

  
//  public void display(){
//    for(int i = 0; i < layers.size(); i++){
//      Layer layer = (Layer) layers.get(i);
//      layer.render();
//    }
//  }
}
