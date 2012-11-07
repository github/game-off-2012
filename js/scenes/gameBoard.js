/**
* This creates a scene for the game board.  The game board will read files that describe levels and build them.
*
* Author: Fork It, We'll do it live!
*/

Crafty.scene("main", function () {
	// Set the background to light gray
	Crafty.background("#9F9F9F");
	
	// Create the player object.  This is a 2d entity with controls (multiway) and collision handling
	Crafty.e("Player, 2D, DOM, solid, player, Multiway, Collision")
		.attr({ x: 20, y: 100, w: gameBoard.tileSize, h: gameBoard.tileSize })
		.multiway(4, { W: -90, S: 90, D: 0, A: 180 })
		.bind('Moved', function(from) {
			// Clamp the user to the edges of the screen
			var newX = Math.max(0, Math.min(gameBoard.getWidth() - gameBoard.tileSize, this.attr('x')));
			var newY = Math.max(0, Math.min(gameBoard.getHeight() - gameBoard.tileSize, this.attr('y')));
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