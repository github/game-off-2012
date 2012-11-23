//create some kind of tree or branch object that takes in an initial triangle and a number of limbs
//function limb(PVector baseA, PVector baseB){}
class Branch{
  PVector[] verticies = new PVector[3];
  color col;
  Branch(PVector a, PVector b, PVector c, color colIn){
    verticies[0] = a;
    verticies[1] = b;
    verticies[2] = c;
    col = colIn;
  }
  
  public void render(PGraphics context, float oX, float oY, float w, float h, float easedDist){
//    context.fill(col);
//    context.noStroke();
//    context.triangle(verticies[0].x, verticies[0].y,verticies[1].x, verticies[1].y,verticies[2].x, verticies[2].y);
      
      fill(col);
      noStroke();
      triangle(verticies[0].x*easedDist+(oX-(w)/2), verticies[0].y*easedDist+(oY-h/2),
                verticies[1].x*easedDist+(oX-(w)/2), verticies[1].y*easedDist+(oY-h/2),
                verticies[2].x*easedDist+(oX-(w)/2), verticies[2].y*easedDist+(oY-h/2));
  }
}
