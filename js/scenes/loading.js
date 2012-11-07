/**
* The loading screen that will display while our assets load
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("loading", function () {
	//load takes an array of assets and a callback when complete
	Crafty.load(["/images/example.png"], function () {
		// Creates the sprite for the player
		Crafty.sprite(32, "/images/example.png", {
			player: [0, 0]
		});
		
		// Simulate a load time for now to make sure this works
		setTimeout(function () {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		}, 500);
	});

	//black background with some loading text
	Crafty.background("#000");
	Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
			.text("Loading")
			.css({  "text-align": "center",
					"color": "white" });
});