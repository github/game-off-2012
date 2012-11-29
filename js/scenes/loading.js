/**
* The loading screen that will display while our assets load
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("loading", function () {
  //load takes an array of assets and a callback when complete
  Crafty.load(["images/sprite_sheet.png"], function () {
    // Creates the sprite for the player
    Crafty.sprite(32, "images/sprite_sheet.png", {
        wall: [0, 13],
        player: [0, 8],
        redBox: [0, 11],
        blueBox: [0, 10],
        whiteBox: [0, 9],
        purpleBox: [0, 12],
        redBoxUnmovable: [1, 11],
        blueBoxUnmovable: [1, 10],
        whiteBoxUnmovable: [1, 9],
        purpleBoxUnmovable: [1, 12],
        portal: [0, 12],
        grayFloor: [2, 13],
        redFloor: [2, 11],
        blueFloor: [2, 10],
        whiteFloor: [2, 9],
        purpleFloor: [2, 12]
    });
    
    // Loads the sprite color module from an external source
    Crafty.modules({ SpriteColor: 'RELEASE' }, function () {
        // Simulate a load time for now to make sure this works
        setTimeout(function () {
          Crafty.scene("9001"); //when everything is loaded, run the main scene
        }, 500);
    });
  });

  //black background with some loading text
  Crafty.background("#000");
  Crafty.e("2D, DOM, Text").attr({ w: 515, h: 515, x: 0, y: 0 })
      .text("Loading...")
      .css({  "padding-top": "200px",
              "text-align": "center",
              "background-color": "black",
              "font-weight": "bold",
              "font-size": "24px",
              "color": "white" });
});
