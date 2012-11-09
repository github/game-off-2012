/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("main", function () {
  // Set the background to light gray
  Crafty.background("#9F9F9F");
  
  Crafty.sprite(32, "images/testsprite.gif", {
    orange1: [15, 11],
    red1: [16,12]
  });
  
  var fifty = false;
  for (var i = 0; i < gameBoard.width; i++) {
    for (var j = 0; j < gameBoard.height; j++) {
        fifty = Crafty.math.randomInt(1,10) === 1 ? true : false;
        if (fifty)
          Crafty.e("2D, DOM, solid, orange1").attr({x: i*gameBoard.tileSize, y: j*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
          
        fifty = Crafty.math.randomInt(1,10) === 1 ? true : false;
        if (fifty)
          Crafty.e("2D, DOM, solid, red1").attr({x: i*gameBoard.tileSize, y: j*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
    }
  }
  
  // Create the player object.  This is a 2d entity with controls (multiway) and collision handling
  Crafty.e("Player, 2D, DOM, player, Movement, Collision")
    .attr({ x: 0, y: 0, w: gameBoard.tileSize, h: gameBoard.tileSize })
    .Moveable(200); // Character speed

  Crafty.e("2D, DOM, PushableBox, Color")
    .color('rgb(0,0,255)')
    .attr({ x: 5 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });
});