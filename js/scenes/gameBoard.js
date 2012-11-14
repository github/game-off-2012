/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("main", function () {
  
  loadMap(9001, function(){
    Crafty.e("2D, DOM, PushableBox, Color, RemovableBox")
      .color('rgb(0,0,255)')
      .attr({ x: 4 * gameBoard.tileSize, y: 4 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });

    Crafty.e("2D, DOM, PushableBox, Color, RemovableBox")
      .color('rgb(0,0,255)')
      .attr({ x: 5 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });

    Crafty.e("2D, DOM, PushableBox, Color, RemovableBox")
      .color('rgb(255,0,0)')
      .attr({ x: 5 * gameBoard.tileSize, y: 4 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });
      
      // Crafty.e("2D, DOM, PushableBox, Color, RemovableBox")
      //   .color('rgb(0,0,255)')
      //   .attr({ x: 12 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });
  });
});