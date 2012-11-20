int originX;
int originY;
float speed;

Circle[] circles = new Circle[12];

void setup(){
  size(800, 800);
  ellipseMode(CENTER);
  noFill();
  originX = width/2;
  originY = height/2;
  speed = 0.003;
  println(easeInExpo(1.2, 1.2, 0,1,1));
  
  background(255);
  
  for(int i = 0; i < circles.length; i++){
    circles[i] = new Circle(1.2/circles.length*i);
    circles[i].render();
  }
}

void draw(){
  background(255);
  for(int i = 0; i < circles.length; i++){
    circles[i].tick();
    circles[i].render();
  }
  stroke(255,0,0,100);
  strokeWeight(8);
  ellipse(lerp(width/2, originX, 0.5), lerp(width/2, originY, 0.5), width, height);
  fill(100);
  noStroke();
  ellipse(width/2,height/2,30,30);
}

class Circle{
  float distance;
  float easedDistance;
  Circle(float d){
    distance = d;
    easedDistance = easeInExpo(distance, distance, 0,1,1);
  }
  
  public void render(){
    strokeWeight(15*easedDistance);
    if(easedDistance >= 0.5 && easedDistance <= 5){
      stroke(0,0,255);
    }else{
      stroke(0);
    }
    
    noFill();
    ellipse(lerp(width/2, originX, easedDistance), lerp(height/2, originY,easedDistance), width*2*easedDistance, height*2*easedDistance);
  }
  
  public void tick(){
    distance += speed;
    if(easedDistance > 4){
      distance = 0;
    }
    easedDistance = easeInExpo(distance, distance, 0,1,1);
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

float easeInQuart(float x, float t, float b, float c, float d) {
  return c*(t/=d)*t*t*t + b;
}

float easeInExpo(float x, float t, float b, float c, float d) {
  return (t==0) ? b : c * pow(2, 10 * (t/d - 1)) + b;
}

float easeInCirc(float x, float t, float b, float c, float d) {
  t /= d;
  return -c * (sqrt(1 - t*t) - 1) + b;
}
