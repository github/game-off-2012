/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("main", function () {
  loadMap(0);
  
  // Create the player object.  This is a 2d entity with controls (multiway) and collision handling
  Crafty.e("Player, 2D, DOM, player, Movement, Collision")
    .attr({ x: 0, y: 0, w: gameBoard.tileSize, h: gameBoard.tileSize })
    .Moveable(200); // Character speed

  Crafty.e("2D, DOM, PushableBox, Color")
    .color('rgb(0,0,255)')
    .attr({ x: 5 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });
});