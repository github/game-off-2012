function loadMap(level, loadComplete) {
  var map = null;
  $.get('map/load/'+level, function(data) {
    map = jQuery.parseJSON(data);
    
    // Set the background to light gray
    Crafty.background("#9F9F9F");
    
    for (var i = 0; i < map.length; i++) {
      var nextMap = '';
      // get and update title
      var title = getMetadata(map[i], 'title');
      if (title)
        $('#levelTitle').text(title.substring(7,title.length));
      // get next map
      var nextMapFinder = getMetadata(map[i], 'nextMap');
      if (nextMapFinder)
        gameBoard.setMap(nextMapFinder.substring(9,nextMapFinder.length));
        
      for (var j = 0; j < map[0].length; j++) {
        var curr = map[i][j];
        var item = " ";
        
        var compareVal = curr ? curr.toUpperCase() : null;
        if (compareVal == 'B')
          item = "blue";
        else if (compareVal == 'W')
          item = "white";
        else if (compareVal == 'P')
          item = "purple";
        else if (compareVal == 'R')
          item = "red";
        else if (compareVal == 'X')
          item = "wall";
        else if (compareVal == 'F')
          item = "portal";
        
        if (curr !== ' ' && curr !== 'S' && curr !== 'F' && curr !== 'X' && curr !== 'W') {
          var definitionString = "2D, DOM, RemovableBox, ColorableBox";
          if (curr && curr != curr.toUpperCase())
              definitionString = definitionString + ", PushableBox";
              
              Crafty.e(definitionString)
              .ColorableBox(item)
              .attr({x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
        }

        if (curr == 'W')
          Crafty.e("2D, DOM, PushableBox, ColorableBox")
          .ColorableBox(item)
          .attr({x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});

        if (curr == 'F')
          Crafty.e("2D, DOM, FinishableBox, " + item).attr({x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize, nextMapKey: nextMap});
          
        if (curr == 'X')
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

function getMetadata(arrLine, attribute) {
  var stringForm = arrLine.join('');
  if (stringForm.match(new RegExp(attribute)))
    return stringForm;
  else
    return null;
}
