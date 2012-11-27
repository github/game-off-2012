

int v1x,v1y,v2x,v2y,v3x,v3y,cx,cy, r;

public void setup(){
  size(800,800);
  noStroke();
  ellipseMode(CENTER);
  cx = width/2;
  cy = height/2;
  r = 20;
  
  v1x = 50;
  v1y = 50;
  v2x = 750;
  v2y = 400;
  v3x = 100;
  v3y = 600;
}

public void draw(){
  background(255);
  if(circIntersectTriangle()){
    fill(2255,0,0);
  }else{
    fill(100);
  }
  
  triangle(v1x,v1y,v2x,v2y,v3x,v3y);
  fill(200);
  ellipse(cx,cy,r*2,r*2);
  println(frameRate);
}

boolean circIntersectTriangle(){
  if(dist(cx,cy,v1x,v1y) < r || dist(cx,cy,v2x,v2y) < r || dist(cx,cy,v3x,v3y) < r){
    return true;
  }else if(PointInTriangle(cx,cy,v1x,v1y,v2x,v2y,v3x,v3y)){
    return true;
  }else if(circleLineIntersect(cx,cy,r, v1x, v1y, v2x, v2y) ||
            circleLineIntersect(cx,cy,r, v2x, v2y, v3x, v3y) ||
            circleLineIntersect(cx,cy,r, v3x, v3y, v1x, v1y)){
    return true;
  }else{
    return false;
  }
  
}

float sign(float p1x, float p1y, float p2x, float p2y, float p3x, float p3y){
  return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
}

boolean PointInTriangle(float ptx, float pty, float v1x, float x1y, float v2x, float v2y, float v3x, float v3y){
  boolean b1, b2, b3;

  b1 = sign(ptx, pty, v1x, v1y, v2x, v2y) < 0.0;
  b2 = sign(ptx, pty, v2x, v2y, v3x, v3y) < 0.0;
  b3 = sign(ptx, pty, v3x, v3y, v1x, v1y) < 0.0;

  return ((b1 == b2) && (b2 == b3));
}

// Thanks, Casey!! :)
// Code adapted from Paul Bourke:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/sphereline/raysphere.c
boolean circleLineIntersect(float cx, float cy, float cr, float x1, float y1, float x2, float y2) {
  float dx = x2 - x1;
  float dy = y2 - y1;
  float a = dx * dx + dy * dy;
  float b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
  float c = cx * cx + cy * cy;
  c += x1 * x1 + y1 * y1;
  c -= 2 * (cx * x1 + cy * y1);
  c -= cr * cr;
  float bb4ac = b * b - 4 * a * c;
 
  //println(bb4ac);
 
  if (bb4ac < 0) {  // Not intersecting
    return false;
  }
  else {
     
    float mu = (-b + sqrt( b*b - 4*a*c )) / (2*a);
    float ix1 = x1 + mu*(dx);
    float iy1 = y1 + mu*(dy);
    mu = (-b - sqrt(b*b - 4*a*c )) / (2*a);
    float ix2 = x1 + mu*(dx);
    float iy2 = y1 + mu*(dy);
 
    // The intersection points
    //ellipse(ix1, iy1, 10, 10);
    //ellipse(ix2, iy2, 10, 10);
     
    float testX;
    float testY;
    // Figure out which point is closer to the circle
    if (dist(x1, y1, cx, cy) < dist(x2, y2, cx, cy)) {
      testX = x2;
      testY = y2;
    } else {
      testX = x1;
      testY = y1;
    }
     
    if (dist(testX, testY, ix1, iy1) < dist(x1, y1, x2, y2) || dist(testX, testY, ix2, iy2) < dist(x1, y1, x2, y2)) {
      return true;
    } else {
      return false;
    }
  }
}


void mouseMoved(){
  cx = mouseX;
  cy = mouseY;
}


