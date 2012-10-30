Crafty.scene("main",function() {

  Crafty.background("#000");

  loadMap("src/levels/map01.tsv",function() {
    console.log("map loaded");

    var player = Crafty.e("2D, Canvas, DOM, SpriteAnimation, PlayerControls, Solid, hero1")
      .attr({x:32, y:32*2, z:1})
      .playerControls(1.5)
      .animate("walk_left", 2, 1, 0)
      .animate("walk_right", 2, 2, 0)
      .animate("walk_up", 2, 3, 0)
      .animate("walk_down", 2, 0, 0)
      .bind("NewDirection",     //change direction when a direction change event is received
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
      .attr({x:32*21, y:32*11, z:1});
  });

});
