//the loading screen that will display while our assets load
Crafty.scene("loading", function() {
  Crafty.load(["images/dungeon.png"
               ,"images/hero.png"
               ,"images/dad.png"
              ,"images/NessPajamas.png"], function() {
    Crafty.scene("main"); //when everything is loaded, run the main scene
  });
});
