/**
* Main entry point for the game.
* 
* TODO:  Get rid of the mvc model below as it doesnt fit into the Crafty Framework
* TODO:  Move components, entities and game logic to separate files.
* TODO:  Move scene manager to another class
*  
* Author: Fork It, We'll do it live!
*/

// Initialize the MVC
var gameBoard = gameBoard || {};
gameBoard.ui = gameBoard.ui || {};
gameBoard.data = gameBoard.data || {};
gameBoard.sceneManager = gameBoard.sceneManager || {};
gameBoard.controller = gameBoard.controller || {};

// Initialize Components
Crafty.c('PushableBox', {
	init: function() {
		this.requires("pushable, solid")
			.bind('push', function(args) {
				var newX = Math.max(0, Math.min(600 - 32, this.x + args.x));
				var newY = Math.max(0, Math.min(600 - 32, this.y + args.y));
				this.x = newX;
				this.y = newY;
			});
		},

    PushableBox: function() {
        return this;
    }
});

// UI - Draw Board
// Draws the game board to the div "renderTo"
gameBoard.ui.drawBoard = function (renderTo) {
	var boardHeight = 600;
	var boardWidth = 600;
	
	Crafty.init(boardHeight, boardWidth);
	Crafty.background('#AFAFAF');
}

// Data - Handles any internal data structures


// Scene Manger - Handles level init / loading / changing / etc
// Individual Scenese will need to be loaded via the scene manager from other files
// For now, we'll go off of this
gameBoard.sceneManager = function (scene) {
	scene = scene || "loading";
	
	Crafty.scene("main", function () {
		//black background with some loading text
		Crafty.background("#AFAFAF");
		Crafty.e("Player, 2D, DOM, solid, player, Multiway, Collision")
			.attr({ x: 20, y: 100, w: 32, h: 32 })
			.multiway(4, { W: -90, S: 90, D: 0, A: 180 })
			.bind('Moved', function(from) {
				var newX = Math.max(0, Math.min(600 - 32, this.attr('x')));
				var newY = Math.max(0, Math.min(600 - 32, this.attr('y')));
				this.attr({ x: newX, y: newY });

				pushables = this.hit('pushable');
				if(pushables){
					pushables[0].obj.trigger('push', {x: this.x - from.x, y: this.y - from.y});
					this.attr({x: from.x, y:from.y});
				}
			});

		Crafty.e("2D, DOM, PushableBox, Color")
			.color('rgb(0,0,255)')
			.attr({ x: 200, y: 200, w: 32, h: 32 });
	});
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function () {
		//load takes an array of assets and a callback when complete
		Crafty.load(["/images/example.png"], function () {
			Crafty.sprite(32, "/images/example.png", {
				player: [0, 0]
			});
			
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
				.text("Loading")
				.css({  "text-align": "center",
						"color": "white" });
	});

	//automatically play the loading scene
	Crafty.scene(scene);
}

// Controller - constructor
gameBoard.Controller = function () {
	
}

$(document).ready(function () {
	var boardController = new gameBoard.Controller();
	gameBoard.ui.drawBoard("#gameBoard");
	
	var sceneManager = new gameBoard.sceneManager("loading");
});