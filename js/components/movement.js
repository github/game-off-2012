/**
* This file contains the player movement component.
*  
* Author: Fork It, We'll do it live!
*/

Crafty.c("Movement", {
	movementEnabled: true,

	_keys: { 
		UP_ARROW: [0,-1],
		DOWN_ARROW: [0,1],
		RIGHT_ARROW: [1,0],
		LEFT_ARROW: [-1,0],
		W: [0,-1],
		S: [0,1],
		D: [1,0],
		A: [-1,0],
	}, 

    init: function() {
		// Map the defined keys to the key codes
		for(var k in this._keys) {
			var keyCode = Crafty.keys[k] || k;
			this._keys[keyCode] = this._keys[k];
		}

		// Trigger a movement in the direction
		this.bind("KeyDown",function(e) {
			if(this._keys[e.key] && this.movementEnabled) {
				var direction = this._keys[e.key];
				this.trigger('CharacterMove',direction);
			}
			// Disable movement if the space key is down
			else if(e.key == gameBoard.actionKey) {
				this.movementEnabled = false;
			}
		});

		// Reenable movement if space is up
		this.bind("KeyUp",function(e) {
			if(e.key == gameBoard.actionKey) {
				this.movementEnabled = true;
			}
		});
    }
});


// Move the character
Crafty.c("CharacterMove", {
	// Init the speed in px per second
	CharacterMove: function(cSpeed) {
		this._speed = cSpeed;
		return this;
	},

    init: function() {
		this._destX = 0; this._sourceX = 0;
		this._destY = 0; this._sourceY = 0;
		this._speed = 200 || this._speed; 
		this._lastFrame = 0;
		this._moving = false;

		this.bind("CharacterMove", function(direction) {
			// Don't do anything if already in motion
			if(this._moving) return false;

			// Let's keep our pre-movement location
			// Hey, Maybe we'll need it later :)
			this._sourceX = this.x;
			this._sourceY = this.y;

			// Figure out our destination
			this._destX = this.x + direction[0] * gameBoard.tileSize;
			this._destY = this.y + direction[1] * gameBoard.tileSize;

			// If the destination is out of bounds, dont move
			if(this._destX > gameBoard.getWidth() || this._destX < 0 || this._destY > gameBoard.getHeight() || this._destY < 0) {
				return false;
			}
			
			// Test to see if the space is filled.  If its filled, dont move
			var collisionDetector = Crafty.e("2D, Collision").attr({ x: this._destX, y: this._destY, w: 1, h: 1 });
			if(collisionDetector.hit("solid")) {
				collisionDetector.destroy();
				return false;
			}
			collisionDetector.destroy();
			
			// Start timing frames
			this._lastFrame = new Date().getTime();
			
			// Start moving
			this._moving = true;
		})
		// This is where the magic happens.  On each frame, get the elapsed time
		// and move the character towards its destination
		.bind("EnterFrame",function(e) {
			if(!this._moving) return false;

			var now = new Date().getTime()
			var dt = (now - (this._lastFrame || now)) / 1000; // Elapsed time in seconds
			this._lastFrame = now;

			var dirX = this._destX - this.x;
			var dirY = this._destY - this.y;

			var normalizedVector = this._normalizeDirection(dirX, dirY);
			
			this.x += normalizedVector[0] * this._speed * dt;
			this.y += normalizedVector[1] * this._speed * dt;
			
			if((this.x === this._destX && this.y === this._destY)) // If the we're at the destination, stop
				this._moving = false;
			// But that rarely happens due to rounding, so if we overshot the destination, set us back at the destination and stop
			else if(this._length((this.x - this._sourceX), (this.y - this._sourceY)) > this._length((this._destX - this._sourceX), (this._destY - this._sourceY))) {
				this._moving = false;
				this.x = this._destX;
				this.y = this._destY;
			}
		});
    }, 

	// Normalize direction
	_normalizeDirection: function(x, y) {
		var length = this._length(x, y);
		return [(x / length), (y / length)];
	},
	
	// Get the length of a vector
	_length: function(x, y) {
		return Math.sqrt((x * x) + (y * y));
	}
  });