// When the DOM has loaded
$(document).ready(function() {
  // Initialize Crafty
  Crafty.init().canvas.init();

  Crafty.scene("main",function() {
    Crafty.background("#000");
    loadMap("levels/map1.tsv",function() {
      var player = Crafty.e("2D, Canvas, PlayerControls, Slide, Solid, hero1")
      .attr({x:0, y:32, z:1});
      var dad = Crafty.e("2D, Canvas, dad1, Solid, AI")
      .attr({x:32, y:32, z:1});
    });
  });

  Crafty.scene("loading");

});
