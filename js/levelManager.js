function loadMap(level, loadComplete) {
  var map = null;
  $.get('map/load/'+level, function(data) {
    map = jQuery.parseJSON(data);
    
    // Set the background to light gray
    Crafty.background("#9F9F9F");
    
    Crafty.sprite(32, "images/testsprite.gif", {
      wall: [13, 3],
      blue: [13, 7],
      green: [16, 9],
      orange: [15, 11],
      red: [16,12]
    });
    
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[0].length; j++) {
        var curr = map[i][j];
        var item = " ";
        if (curr == 'B')
          item = "blue";
        else if (curr == 'G')
          item = "green";
        else if (curr == 'O')
          item = "orange";
        else if (curr == 'R')
          item = "red";
        else if (curr == 'W')
          item = "wall";
        
        if (item !== " ")
          Crafty.e("2D, DOM, solid, " + item).attr({x: j*gameBoard.tileSize, y: (i)*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
      }
    }
    loadComplete();
  });
}