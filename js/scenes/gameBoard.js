/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("main", function () {
  // Set the background to light gray
  Crafty.background("#9F9F9F");
  
  Crafty.sprite(32, "images/testsprite.gif", {
    wall: [13, 3],
    blue: [13, 7],
    green: [16, 9],
    orange: [15, 11],
    red: [16,12]
  });
  
  var testTemplate = [['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
                      ['B','B','B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
                      ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
                      ['O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
                      ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R','R']];
  
  for (var i = 0; i < testTemplate.length; i++) {
    for (var j = 0; j < testTemplate[0].length; j++) {
      var curr = testTemplate[i][j];
      var item = "wall";

      if (curr == 'B')
        item = "blue";
      else if (curr == 'G')
        item = "green";
      else if (curr == 'O')
        item = "orange";
      else if (curr == 'R')
        item = "red";
      
      Crafty.e("2D, DOM, solid, " + item).attr({x: j*gameBoard.tileSize, y: (i+7)*gameBoard.tileSize, w: gameBoard.tileSize, h: gameBoard.tileSize});
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