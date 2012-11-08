/**
* Main entry point for the game.
* 
* Author: Fork It, We'll do it live!
*/

var gameBoard = {
  height: 16,     // Height in tiles
  width: 16,      // Width in tiles
  tileSize: 32,   // Tile size in px squared
  actionKey: 32,    // Spacebar is the action key

  getHeight: function () {
    return this.height * this.tileSize;
  },
  
  getWidth: function () {
    return this.width * this.tileSize;
  }
}

$(document).ready(function () {
  Crafty.init(gameBoard.getWidth(), gameBoard.getHeight());
  Crafty.scene("loading");
});