/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("9001", function () {
  loadMap(9001, function(){
    console.log('map 9001 loaded');
  });
});

Crafty.scene("0", function () {
  loadMap(0, function(){
    console.log('map 0 loaded');
  });
});

Crafty.scene("1", function () {
  loadMap(1, function(){
    console.log('map 1 loaded');
  });
});