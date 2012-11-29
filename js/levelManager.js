function loadMap(level, loadComplete) {
  var map = null;
  $.get('map/load/'+level, function(data) {
      mapData = jQuery.parseJSON(data);
      var map = null;
      // Set the background to light gray
      Crafty.background("#9F9F9F");
      // get and update title
      $('#levelTitle').text(mapData.metadata.title);
      // get next map
      var nextMap = mapData.metadata.nextMap;
      gameBoard.setMap(nextMap);
      
      for (var a = 0; a < mapData.layers.length; a++) {
        map = mapData.layers[a];
        for (var i = 0; i < map.length; i++) {
          for (var j = 0; j < map[0].length; j++) {
            var curr = map[i][j];
            var item = " ";
            
            var compareVal = curr ? curr.toUpperCase() : null;
            item = getItem(compareVal);
            
            if (curr !== ' ' && curr !== 'S' && curr !== 'F' && curr !== 'X' && curr !== 'W' && curr !== '-') {
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
              Crafty.e("Player, 2D, Canvas, player, Movement, Collision, Phil, SpriteColor")
                .attr({ x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize })
                .spriteColor("FFFFFF", 0.0)
                .Moveable(200); // Character speed
          }
        }
      }
      loadComplete();
      Crafty.trigger("StopMovement");
  });
}

function getMetadata(arrLine, attribute) {
  var stringForm = arrLine.join('');
  if (stringForm.match(new RegExp(attribute)))
    return stringForm;
  else
    return null;
}

function getItem(compareVal) {
  if (compareVal == 'B')
    return "blue";
  else if (compareVal == 'W')
    return "white";
  else if (compareVal == 'P')
    return "purple";
  else if (compareVal == 'R')
    return "red";
  else if (compareVal == 'X')
    return "wall";
  else if (compareVal == 'F')
    return "portal";
}