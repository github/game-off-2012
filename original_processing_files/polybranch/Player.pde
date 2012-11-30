class Player{
  
  PVector pos;
  float r;
  int speed;
  float velX, velY;
  float hue;
  
  Player(){
    pos = new PVector(width/2,height/2);
    r = 20;
    speed = 6;
    hue = 0;
  }
  
  public void reset(){
    pos.x = width/2;
    pos.y = width/2;
    r = 20;
    speed = 6;
    velX = velY = 0;
  }
}
