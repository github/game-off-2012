// When the DOM has loaded
$(document).ready(function() {

  // Initialize Crafty 640 Pixels Wide 480 Pixles Tall
  Crafty.init(640,480).canvas.init();
  Crafty.background("black");
  
  // This will create entities called floor, wall1 and stairs
  Crafty.sprite(32,"images/dungeon.png", {
     floor: [0,0],
     wall1: [2,1],
     stairs: [3,1]
  });

  // This will create entities called hero1
  Crafty.sprite(32,"images/hero.png", {
     hero1: [1,0]
  });
  // This will create entities called dad1
  Crafty.sprite(32,"images/dad.png", {
     dad1: [1,0]
  });

  Crafty.scene("loading", function() {
    Crafty.load(["images/dungeon.png","images/hero.png","images/dad.png"], function() {
         Crafty.scene("main"); // Run the main scene
    });
  });
 
  // Let's draw us a Hero and a Blob
  Crafty.scene("main",function() {
    Crafty.background("#FFF");
    var player = Crafty.e("2D, Canvas, PlayerControls, Slide, hero1")
         .attr({x:0, y:0});

    var dad = Crafty.e("2D, Canvas, dad1")
         .attr({x:50, y:50});
  });

  Crafty.scene("loading");
});
