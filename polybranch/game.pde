class Game{
  ArrayList layers;
  String origin;
  boolean drawnPlayer;
  
  float speed;

  Game(){
    origin = "I EXIST";
    layers = new ArrayList();
    
    drawnPlayer = false;
   
    speed = 0.003;
    
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
  
//  public void display(){
//    for(int i = 0; i < layers.size(); i++){
//      Layer layer = (Layer) layers.get(i);
//      layer.render();
//    }
//  }
}
