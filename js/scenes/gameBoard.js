/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("main", function () {
  
  loadMap(9001, function(){
    // Crafty.e("2D, DOM, PushableBox, RemovableBox, ColorBox")
    //   .ColorBox("blue")
    //   .attr({ x: 4 * gameBoard.tileSize, y: 4 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });
    // 
    // Crafty.e("2D, DOM, PushableBox, RemovableBox, ColorBox")
    //   .ColorBox("blue")
    //   .attr({ x: 5 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize });
    // 
    // Crafty.e("2D, DOM, PushableBox, RemovableBox, ColorBox")
    //   .attr({ x: 5 * gameBoard.tileSize, y: 4 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize })
    //   .ColorBox("red");
    // 
    // Crafty.e("2D, DOM, PushableBox, RemovableBox, ColorableBox")
    //   .attr({ x: 7 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize })
    //   .ColorableBox("purple");
    //   
    // Crafty.e("2D, DOM, PushableBox, RemovableBox, ColorableBox")
    //   .attr({ x: 8 * gameBoard.tileSize, y: 5 * gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize })
    //   .ColorableBox("red");
  });
});