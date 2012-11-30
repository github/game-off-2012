class Game{
  ArrayList layers;
  String origin;
  boolean drawnPlayer;
  int score;
  int level;
  int levelUp = 3;
  
  int numBranches;
  
  float[] speeds = { 0.0025, 0.003, 0.0035, 0.004, 0.0045, 0.005, 0.0055, 0.006, 0.0065, 0.007, 0.0075, 0.008 };
  
  
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
      if(i < 4){
        layers.add(new Layer(16, width, height, "active"));
      }else{
        layers.add(new Layer(16, width, height, "inactive"));
      }
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
        if(levelUp == 0 || levelUp == 2){
          layer.reset("inactive");
          levelUp ++;
        }else if(levelUp == 1){
          layer.reset("level");
          levelUp ++;
        }else{
          layer.reset("active");
        }
        
      }else{
        layer.updateDist(speed);
        if(layer.easedDistance >= 1 && !drawnPlayer){
          drawPlayer();
        }
        layer.render();
      }
    }
  }
  
  void drawPlayer(){
    noStroke();
    fill(50,200);
    ellipse(width/2,height/2,player.r*2,player.r*2);
    drawPolygon(lerp(width/2, originX, 1), lerp(height/2, originY,1), width/2, 16, 6, color(0,0,0));
    drawnPlayer = true;
  }
  
  void checkLevel(){
    if(score > 18000 && level < 8){
      level = 8;
      numBranches = 13;
      levelUp = 0;
      //speed = 0.004;
    }else if(score > 12000 && level < 7){
      level = 7;
      numBranches = 12;
      levelUp = 0;
      //speed = 0.004;
    }else if(score > 8000 && level < 6){
      level = 6;
      numBranches = 11;
      levelUp = 0;
      //speed = 0.004;
    }else if(score > 5000 && level < 5){
      level = 5;
      numBranches = 10;
      levelUp = 0;
      //speed = 0.004;
    }else if(score > 3500 && level < 4){
      level = 4;
      numBranches = 9;
      levelUp = 0;
      //speed = 0.004;
    }else if(score > 2000 && level < 3){
      level = 3;
      numBranches = 8;
      levelUp = 0;
      //speed = 0.0035;
    }else if(score > 500 && level < 2){
      level = 2;
      numBranches = 7;
      levelUp = 0;
      //speed = 0.003;
    }else{
      //level = 1;
      //numBranches = 6;
      //speed = 0.0025;
    }
    
//    if(score < 30000){
//      speed = map(score, 0,30000, 0.0025,0.009);
//    }
  }
  
  public void gameOver(){
    drawPlayer();
    noLoop();
  }
  

  
//  public void display(){
//    for(int i = 0; i < layers.size(); i++){
//      Layer layer = (Layer) layers.get(i);
//      layer.render();
//    }
//  }
}
