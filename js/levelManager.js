var levelManager = {
    tileMap: {
        B: function (x, y) { levelManager.createRemovableBox("blue", x, y); },
        W: function (x, y) { levelManager.createPushableBox("white", x, y); },
        R: function (x, y) { levelManager.createRemovableBox("red", x, y); },
        P: function (x, y) { levelManager.createRemovableBox("purple", x, y); },
        b: function (x, y) { levelManager.createPushableRemovableBox("blue", x, y); },
        w: function (x, y) { levelManager.createPushableRemovableBox("white", x, y); },
        r: function (x, y) { levelManager.createPushableRemovableBox("red", x, y); },
        p: function (x, y) { levelManager.createPushableRemovableBox("purple", x, y); },
        X: function (x, y) { levelManager.createWall(x, y); },
        F: function (x, y) { levelManager.createFinishTile(x, y); },
        S: function (x, y) { levelManager.createPlayer(x, y); },
        "-": function (x, y) { levelManager.createFloor(x, y); },
        "1": function (x, y) { levelManager.createColorFloor("blue", x, y); },
        "2": function (x, y) { levelManager.createColorFloor("white", x, y); },
        "3": function (x, y) { levelManager.createColorFloor("red", x, y); },
        "4": function (x, y) { levelManager.createColorFloor("purple", x, y); }
    },

    createRemovableBox: function (color, x, y) {
        Crafty.e("2D, DOM, RemovableBox, ColorableBox")
        .ColorableBox(color)
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createPushableRemovableBox: function (color, x, y) {
        Crafty.e("2D, DOM, RemovableBox, ColorableBox, PushableBox")
        .ColorableBox(color)
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createPushableBox: function (color, x, y) {
        Crafty.e("2D, DOM, ColorableBox, PushableBox")
        .ColorableBox(color)
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createFinishTile: function (x, y) {
        Crafty.e("2D, DOM, FinishableBox, portal").attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createWall: function (x, y) {
        Crafty.e("2D, DOM, solid, wall").attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createPlayer: function (x, y) {
        Crafty.e("Player, 2D, Canvas, player, Movement, Collision, Phil, SpriteColor")
        .attr({ x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize, z:5 })
        .spriteColor("FFFFFF", 0.0)
        .Moveable(200); // Character speed
    },
    createFloor: function (x, y) {
        Crafty.e("Floor")
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createColorFloor: function (color, x, y) {
        Crafty.e("ColorFloor")
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize})
        .ColorFloor(color);
    },
    
    loadMap: function (level, loadComplete) {
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
          console.log("set", nextMap);
          
          for (var a = 0; a < mapData.layers.length; a++) {
            map = mapData.layers[a];
            for (var i = 0; i < map.length; i++) {
              for (var j = 0; j < map[0].length; j++) {
                if(levelManager.tileMap[map[i][j]])
                    levelManager.tileMap[map[i][j]](j, i);
              }
            }
          }
          loadComplete();
          Crafty.trigger("StopMovement");
      });
    }
}

