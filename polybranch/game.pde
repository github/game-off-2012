class Game{
  ArrayList layers;
  String origin;
  Game(){
    origin = "I EXIST";
    layers = new ArrayList();
    //make 6 layers
    for(int i = 0; i < 6; i++){
      layers.add(new Layer(16, width, height));
    }
    //set the distance var for these 6 layers
    for(int i = layers.size(); i > 0; i--){
      Layer layer = (Layer) layers.get(i-1);
      println(1.0/(i));
      layer.distance = 1.0/(i);
    }
    
    println("game has "+layers.size());
  }
  
  public void update(){
  
  }
  
  public void display(){
    for(int i = layers.size() -1; i >= 0; i--){
      Layer layer = (Layer) layers.get(i);
      layer.render();
    }
  }
}
