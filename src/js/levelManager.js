var levelManager = {
    tileMap: {
        B: function (x, y) { levelManager.createRemovableBox("blue", x, y); },
        W: function (x, y) { levelManager.createRemovableBox(null, x, y); },
        R: function (x, y) { levelManager.createRemovableBox("red", x, y); },
        P: function (x, y) { levelManager.createRemovableBox("purple", x, y); },
        G: function (x, y) { levelManager.createRemovableBox("green", x, y); },
        b: function (x, y) { levelManager.createPushableRemovableBox("blue", x, y); },
        w: function (x, y) { levelManager.createPushableRemovableBox(null, x, y); },
        r: function (x, y) { levelManager.createPushableRemovableBox("red", x, y); },
        p: function (x, y) { levelManager.createPushableRemovableBox("purple", x, y); },
        g: function (x, y) { levelManager.createPushableRemovableBox("green", x, y); },
        X: function (x, y) { levelManager.createWall(x, y); },
        F: function (x, y) { levelManager.createFinishTile(x, y); },
        S: function (x, y) { levelManager.createPlayer(x, y); },
        "-": function (x, y) { levelManager.createFloor(x, y); },
        "1": function (x, y) { levelManager.createColorFloor("blue", x, y); },
        "2": function (x, y) { levelManager.createColorFloor("white", x, y); },
        "3": function (x, y) { levelManager.createColorFloor("red", x, y); },
        "4": function (x, y) { levelManager.createColorFloor("purple", x, y); },
        "5": function (x, y) { levelManager.createPushableNonColorableBox("blue", x, y); },
        "6": function (x, y) { levelManager.createPushableNonColorableBox("white", x, y); },
        "7": function (x, y) { levelManager.createPushableNonColorableBox("red", x, y); },
        "8": function (x, y) { levelManager.createPushableNonColorableBox("purple", x, y); },
        u: function (x, y) { levelManager.createPushableNonColorableRemovableBox("blue", x, y); },
        i: function (x, y) { levelManager.createPushableNonColorableRemovableBox("white", x, y); },
        o: function (x, y) { levelManager.createPushableNonColorableRemovableBox("red", x, y); },
        l: function (x, y) { levelManager.createPushableNonColorableRemovableBox("purple", x, y); }
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
    createPushableNonColorableBox: function (color, x, y) {
        Crafty.e("2D, DOM, PushableBox")
        .ColorableBox(color)
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createPushableNonColorableRemovableBox: function (color, x, y) {
        Crafty.e("2D, DOM, PushableBox, RemovableBox")
        .ColorableBox(color)
        .attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    },
    createFinishTile: function (x, y) {
        Crafty.e("2D, Canvas, FinishableBox, portal").attr({x: x*gameBoard.tileSize, y: y*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
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
            Crafty.scene(level.toString(), function () {
                mapData = jQuery.parseJSON(data);
                var map = null;
                // Set the background to light gray
                Crafty.background("#9F9F9F");
                // get and update title
                $('#levelTitle').text(mapData.metadata.title);
                $('#levelText').text(mapData.metadata.text);
                console.log(mapData.metadata.text);
                // get next map
                var nextMap = mapData.metadata.nextMap;
                gameBoard.setMap(nextMap);
                gameBoard.currentMap = level;
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
                if(loadComplete) loadComplete();
            });
            Crafty.scene(level.toString());
            Crafty.trigger("StopMovement");
        });
    },
    
    resetLevel: function () {
      Crafty.scene(gameBoard.currentMap);
    }
}

