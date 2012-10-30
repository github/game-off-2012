// When the DOM has loaded
$(document).ready(function() {

  // Initialize Crafty 640 Pixels Wide 480 Pixles Tall
  Crafty.init().canvas.init();
  Crafty.background("black");

  // Let's draw us a Hero and a Blob
  Crafty.scene("main",function() {
    Crafty.background("#FFF");
    var player = Crafty.e("2D, Canvas, PlayerControls, Slide, hero1")
         .attr({x:0, y:0});

    var dad = Crafty.e("2D, Canvas, dad1, AI")
         .attr({x:50, y:50});
  });

  Crafty.scene("loading");
});
