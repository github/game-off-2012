//create some kind of tree or branch object that takes in an initial triangle and a number of limbs
//function limb(PVector baseA, PVector baseB){}
class Branch{
  PVector[] verticies = new PVector[3];
  color col;
  int hu,sat,br,alph;
  Branch(PVector a, PVector b, PVector c){
    verticies[0] = a;
    verticies[1] = b;
    verticies[2] = c;
    hu = 0;
    sat = 0;
    br = (int)random(50,200);
    alph = 255;
  }
  
  public void render(float oX, float oY, float w, float h, float easedDist){
      alph = (easedDist > 1) ? (int)map(easedDist, 1, 4, 255, 0) : 255;
      fill(br,alph);
      noStroke();
      triangle(verticies[0].x*easedDist+(oX-(w)/2), verticies[0].y*easedDist+(oY-h/2),
                verticies[1].x*easedDist+(oX-(w)/2), verticies[1].y*easedDist+(oY-h/2),
                verticies[2].x*easedDist+(oX-(w)/2), verticies[2].y*easedDist+(oY-h/2));
  }
}
