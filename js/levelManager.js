function loadMap(level, loadComplete) {
  var map = null;
  $.get('map/load/'+level, function(data) {
    map = jQuery.parseJSON(data);
    
    // Set the background to light gray
    Crafty.background("#9F9F9F");
    
    Crafty.sprite(32, "images/sprite_sheet.png", {
      wall: [0, 13],
      white: [0, 9],
      blue: [0, 10],
      red: [0, 11],
      purple: [0, 12]
    });
    
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[0].length; j++) {
        var curr = map[i][j];
        var item = " ";
        if (curr == 'B')
          item = "blue";
        else if (curr == 'H')
          item = "white";
        else if (curr == 'P')
          item = "purple";
        else if (curr == 'R')
          item = "red";
        else if (curr == 'W')
          item = "wall";
        
        if (item !== ' ' && item !== 'S')
          Crafty.e("2D, DOM, solid, " + item).attr({x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
          
        if (curr == 'S')
          Crafty.e("Player, 2D, DOM, player, Movement, Collision, Phil")
            .attr({ x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize })
            .Moveable(200); // Character speed
      }
    }
    loadComplete();
  });
}
