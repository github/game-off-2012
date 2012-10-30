//the loading screen that will display while our assets load
Crafty.scene("loading", function() {
console.log("loadin");
  Crafty.load(["resources/images/dungeon.png"
               ,"resources/images/hero.png"
               ,"resources/images/dad.png"], function() {

                 Crafty.scene("main"); //when everything is loaded, run the main scene
  });
});
