//create some kind of tree or branch object that takes in an initial triangle and a number of limbs
//function limb(PVector baseA, PVector baseB){}
class Branch{
  PVector[] verticies = new PVector[3];
  PVector[] easedVerticies = new PVector[3];
  color col;
  int hu,sat,br,alph;
  
  Branch(){
    verticies[0] = new PVector(0,0);
    verticies[1] = new PVector(0,0);
    verticies[2] = new PVector(0,0);
    
    //initialized eased verticies as blanks
    easedVerticies[0] = new PVector(0,0);
    easedVerticies[1] = new PVector(0,0);
    easedVerticies[2] = new PVector(0,0);
    
    hu = 0;
    sat = 0;
    br = (int)random(50,200);
    alph = 255;
  }
  
  Branch(PVector a, PVector b, PVector c){
    verticies[0] = a;
    verticies[1] = b;
    verticies[2] = c;
    
    //initialized eased verticies as blanks
    easedVerticies[0] = new PVector(0,0);
    easedVerticies[1] = new PVector(0,0);
    easedVerticies[2] = new PVector(0,0);
    
    hu = 0;
    sat = 0;
    br = (int)random(50,200);
    alph = 255;
  }
  
  public void setPos(float oX, float oY, float w, float h, float easedDist){
    easedVerticies[0].x = verticies[0].x*easedDist+(oX-(w)/2);
    easedVerticies[0].y = verticies[0].y*easedDist+(oY-h/2);
    easedVerticies[1].x = verticies[1].x*easedDist+(oX-(w)/2);
    easedVerticies[1].y = verticies[1].y*easedDist+(oY-h/2);
    easedVerticies[2].x = verticies[2].x*easedDist+(oX-(w)/2);
    easedVerticies[2].y = verticies[2].y*easedDist+(oY-h/2);
  }
  
  public void render(float oX, float oY, float w, float h, float easedDist){
      alph = (easedDist > 2) ? (int)map(easedDist, 2, 8, 255, 0) : 255;
      fill(br,alph);
      noStroke();
      triangle(easedVerticies[0].x, easedVerticies[0].y,
                easedVerticies[1].x, easedVerticies[1].y,
                easedVerticies[2].x, easedVerticies[2].y);
  }
  
  //collision detection functions
  public void playerOverlap(){
    if(dist(player.pos.x,player.pos.y,easedVerticies[0].x,easedVerticies[0].y) < player.r ||
        dist(player.pos.x,player.pos.y,easedVerticies[1].x,easedVerticies[1].y) < player.r ||
        dist(player.pos.x,player.pos.y,easedVerticies[2].x,easedVerticies[2].y) < player.r){
      //return true;
      br = 0;
      g.gameOver();
    }else if(PointInTriangle(player.pos.x,player.pos.y,easedVerticies[2].x,easedVerticies[2].y,easedVerticies[1].x,easedVerticies[1].y,easedVerticies[0].x,easedVerticies[0].y)){
      //return true;
      br = 0;
      g.gameOver();
    }else if(circleLineIntersect(player.pos.x,player.pos.y, player.r, easedVerticies[0].x,easedVerticies[0].y, easedVerticies[1].x,easedVerticies[1].y) ||
              circleLineIntersect(player.pos.x,player.pos.y, player.r, easedVerticies[1].x,easedVerticies[1].y, easedVerticies[2].x,easedVerticies[2].y) ||
              circleLineIntersect(player.pos.x,player.pos.y, player.r, easedVerticies[2].x,easedVerticies[2].y, easedVerticies[0].x,easedVerticies[0].y)){
      //return true;
      br = 0;
      g.gameOver();
    }else{
      //return false;
    }
  }
  
  float sign(float p1x, float p1y, float p2x, float p2y, float p3x, float p3y){
    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
  }
  
  boolean PointInTriangle(float ptx, float pty, float v1x, float v1y, float v2x, float v2y, float v3x, float v3y){
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
}
