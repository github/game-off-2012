PVector[] tris = {
      new PVector(200,200),
      new PVector(400,200),
      new PVector(0,100)
    };
    
Branch bob = new Branch(
                new PVector(100, 500),
                new PVector(300, 500),
                new PVector(200, 300),
                color(150));
Branch steve = new Branch(
                new PVector(bob.verticies[2].x, bob.verticies[2].y),
                new PVector(lerp(bob.verticies[2].x, bob.verticies[1].x, 0.3), lerp(bob.verticies[2].y, bob.verticies[1].y, 0.3)),
                new PVector(400, 100));

void setup(){
  size(500,500);
  background(255);
  //triangle(tris[0].x, tris[0].y,tris[1].x, tris[1].y,tris[2].x, tris[2].y);
  //triangle(tris[2].x,tris[2].y, lerp(tris[1].x,tris[2].x,0.7),lerp(tris[1].y,tris[2].y,0.7), 250,0);
  bob.render();
  steve.render();
}

class Tree{
  Branch branches[];
  Tree(int numLimbs, Limb limb0){
    branches = new Branch[numLimbs];
  }
  
  void populateTree(){
    
  }
}

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
  
  public void render(){
    fill(col);
    triangle(verticies[0].x, verticies[0].y,verticies[1].x, verticies[1].y,verticies[2].x, verticies[2].y);
  }
}

