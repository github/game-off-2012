// When the DOM has loaded
$(document).ready(function() {
  // Initialize Crafty
  Crafty.init().canvas.init();

  Crafty.scene("main",function() {
    Crafty.background("#000");
    loadMap("levels/map1.tsv",function() {
      var player = Crafty.e("2D, Canvas, DOM, SpriteAnimation, PlayerControls, Solid, hero1")
      .attr({x:0, y:32, z:1})
      .playerControls(1.5)
      .animate("walk_left", 2, 1, 0)
      .animate("walk_right", 2, 2, 0)
      .animate("walk_up", 2, 3, 0)
      .animate("walk_down", 2, 0, 0)
      //change direction when a direction change event is received
      .bind("NewDirection",
        function (direction) {
          if (direction.x < 0) {
              if (!this.isPlaying("walk_left"))
                  this.stop().animate("walk_left", 30, -1);
          }
          if (direction.x > 0) {
              if (!this.isPlaying("walk_right"))
                  this.stop().animate("walk_right", 30, -1);
          }
          if (direction.y < 0) {
              if (!this.isPlaying("walk_up"))
                  this.stop().animate("walk_up", 30, -1);
          }
          if (direction.y > 0) {
              if (!this.isPlaying("walk_down"))
                  this.stop().animate("walk_down", 30, -1);
          }
          if(!direction.x && !direction.y) {
              this.stop();
          }
        });
      var dad = Crafty.e("2D, Canvas, dad1, Solid, AI")
      .attr({x:32, y:32, z:1});
    });
  });

  Crafty.scene("loading");

});
