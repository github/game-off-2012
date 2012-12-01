/**
* Main entry point for the game.
* 
* Author: Fork It, We'll do it live!
*/

var gameBoard = {
  height: 16,       // Height in tiles
  width: 16,        // Width in tiles
  tileSize: 32,     // Tile size in px squared
  actionKey: 32,    // Spacebar is the action key
  removeKey: 70,    // F is the remove key
  colorKey: 69,     // E is the take / give color key
  standardAnimationLength: 50,   // Number of frames to play animations
  nextMap: '',
  currentMap: '',
  
  colorTextMap: {
    white: "#AFAFAF",
    blue: "#4D45E6",
    red: "#DD0000",
    purple: "#DFDFDF",
    green: "#87E01B"
  },
  
  colorMap: {
    white: "#DFDFDF",
    blue: "#000051",
    red: "#730001",
    purple: "#5a005a",
    green: "#2BFF00"
  },

  getHeight: function () {
    return this.height * this.tileSize;
  },
  
  getWidth: function () {
    return this.width * this.tileSize;
  },
  
  setMap: function(name) {
    this.nextMap = name;
  },
  
  getMap: function() {
    return this.nextMap;
  }
}

function showHelp()
{
    $(".screenMask").show();
    $("#helpScreen").show();
}

function closeHelp()
{
    $(".screenMask").hide();
    $("#helpScreen").hide();
}

$(document).ready(function () {
  Crafty.init(gameBoard.getWidth(), gameBoard.getHeight());
  Crafty.scene("loading");
  
  // Disable space bar page scrolling
  window.onkeydown = function(e) { 
    return !($.inArray(e.keyCode, [32,33,34,35,36,37,38,39,40]));
  };
});