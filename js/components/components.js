/**
* This file contains the common components for the game.
*  
* Author: Fork It, We'll do it live!
*/

/**
* Pushable Box
* Adds a listener to the push trigger.  
*/
Crafty.c('PushableBox', {
	init: function() {
		this.requires("pushable, solid")
			.bind('push', function(args) {
				var newX = Math.max(0, Math.min(gameBoard.getWidth() - gameBoard.tileSize, this.x + args.x));
				var newY = Math.max(0, Math.min(gameBoard.getHeight() - gameBoard.tileSize, this.y + args.y));
				this.x = newX;
				this.y = newY;
			});
		},

    PushableBox: function() {
        return this;
    }
});