int originX;
int originY;
float speed;

Circle[] circles = new Circle[10];

void setup(){
  size(800, 800);
  ellipseMode(CENTER);
  noFill();
  originX = width/2;
  originY = height/2;
  speed = 0.003;
  println(easeInCubic(0.5, 0.5, 0,1,1));
  
  background(255);
  
  for(int i = 0; i < circles.length; i++){
    circles[i] = new Circle(1.0/circles.length*i);
    circles[i].render();
  }
}

void draw(){
  background(255);
  for(int i = 0; i < circles.length; i++){
    circles[i].tick();
    circles[i].render();
  }
}

class Circle{
  float distance;
  float easedDistance;
  Circle(float d){
    distance = d;
    easedDistance = easeInCubic(distance, distance, 0,1,1);
  }
  
  public void render(){
    strokeWeight(15*easedDistance);
    ellipse(lerp(width/2, originX, easedDistance), lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
  }
  
  public void tick(){
    distance += speed;
    if(distance > 1){
      distance = 0;
    }
    easedDistance = easeInCubic(distance, distance, 0,1,1);
  }
}

void mouseMoved(){
  originX = mouseX;
  originY = mouseY;
  //if(dist(int(mouseX),int(mouseY), int(width/2), int(height/2)) < width/2){
    
  //}
}

//val/max, val, start, end, max
float easeInQuad(float x, float t, float b, float c, float d) {
  return c*(t/=d)*t + b;
}

float easeInCubic(float x, float t, float b, float c, float d) {
  return c*(t/=d)*t*t + b;
}

