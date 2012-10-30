Crafty.sprite(32,"images/dungeon.png", {
  floor: [0,1],
  wall1: [9,0],
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

//the loading screen that will display while our assets load
Crafty.scene("loading", function() {
  Crafty.load(["images/dungeon.png","images/hero.png","images/dad.png"], function() {
    Crafty.scene("main"); //when everything is loaded, run the main scene
  });
});

function loadMap(file, callback) {
  $.get(file,function(data) {
    var level = [];
    // Split out each row
    $.each(data.split("\n"),function(y,row) {
      var columns = row.split("\t");
      level.push(columns);
      // Then split out each column
      $.each(columns,function(x,column) {
        if(column) {
          Crafty.e("2D, Canvas, floor, Floor").attr({x:x * 32, y: y * 32});
        } else {
          Crafty.e("2D, Canvas, wall1, Wall").attr({x:x * 32, y: y * 32});
        }
      });

    });
    callback(level);
  });
}
