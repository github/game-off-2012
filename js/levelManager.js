function loadMap(level, loadComplete) {
  var map = null;
  $.get('map/load/'+level, function(data) {
    map = jQuery.parseJSON(data);
    
    // Set the background to light gray
    Crafty.background("#9F9F9F");

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
        else if (curr == 'F')
          item = "portal";
          
        if (curr !== ' ' && curr !== 'S' && curr !== 'F' && curr !== 'W')
          Crafty.e("2D, DOM, PushableBox, RemovableBox, ColorBox")
          .ColorBox(item)
          .attr({x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});

        if (curr == 'F' || curr == 'W')
          Crafty.e("2D, DOM, solid, " + item).attr({x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
          
        if (curr == 'S')
          Crafty.e("Player, 2D, DOM, player, Movement, Collision, Phil")
            .attr({ x: j*gameBoard.tileSize, y: i*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize })
            .Moveable(200); // Character speed
      }
      // get and update title
      var title = getMetadata(map[i], 'title');
      if (title)
        $('#levelTitle').text(title.substring(7,title.length));
      // get next map
      var nextMap = getMetadata(map[i], 'nextMap');
      if (nextMap)
        console.log('nextMap: ', nextMap.substring(9,nextMap.length));
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
