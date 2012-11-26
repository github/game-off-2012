/**
* This file contains the common components for the game.
*  
* Author: Fork It, We'll do it live!
*/

/**
* Moves an entity by one tile
* Input is an array of directions to traven ie [-1, 0]
* Constructor take in a speed which is pixels per second
*/
// Move the entity
Crafty.c("Moveable", {
    // Init the speed in px per second
    Moveable: function(cSpeed) {
        this._speed = cSpeed;
        return this;
    },

    init: function() {
        this._destX = 0; this._sourceX = 0;
        this._destY = 0; this._sourceY = 0;
        this._speed = 200 || this._speed; 
        this._lastFrame = 0;
        this._moving = false;

        // This is where the magic happens.  On each frame, get the elapsed time
    // and move the character towards its destination
    this.bind("EnterFrame",function(e) {
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
  
    EntityMove: function (direction) {
        var force = direction[2] ? direction[2] : false;
  
        // Can only move one tile
        if(this._length(direction[0], direction[1]) > 1)
            return false;

        // Don't do anything if already in motion
        if(this._moving) return false;

        // Starting location
        this._sourceX = this.x;
        this._sourceY = this.y;

        // Figure out our destination
        this._destX = this.x + direction[0] * gameBoard.tileSize;
        this._destY = this.y + direction[1] * gameBoard.tileSize;

        // If the destination is out of bounds, dont move
        if(this._destX > gameBoard.getWidth() || this._destX < 0 || this._destY > gameBoard.getHeight() || this._destY < 0) {
            return false;
        }

        if(!force) {
            // Test to see if the space is filled.  If its filled, dont move
            if(!this.canMoveToCoordinates(this._destX, this._destY))
                return false;
        }
      
        // Start timing frames
        this._lastFrame = new Date().getTime();
        
        this.checkForFinish(this._destX, this._destY);
        
        // Start moving
        this._moving = true;
        return true;
    },

      // Detects if an entity can move to a location on the board
      // Hitting a solid will cause this to return false
    canMoveToCoordinates: function (xLoc, yLoc) {
      var collisionDetector = Crafty.e("2D, Collision").attr({ x: xLoc, y: yLoc, w: 1, h: 1 });
      if(collisionDetector.hit("solid")) {
        collisionDetector.destroy();
        return false;
      }
      collisionDetector.destroy();
      return true;
    },
    
    // Check for finish tile
    checkForFinish: function(xLoc, yLoc) {
      var collisionDetector = Crafty.e("2D, Collision").attr({ x: xLoc, y: yLoc, w: 1, h: 1 });
      if(collisionDetector.hit("FinishableBox")) {
        collisionDetector.destroy();
        console.log(gameBoard.getMap());
        // loadMap(gameBoard.getMap(), function(){
        //   
        // });
      Crafty.scene(gameBoard.getMap()); //when everything is loaded, run the main scene
      }
      collisionDetector.destroy();
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

/**
* Adds stylable text to the entity.
* Displays text on the entity
*/
Crafty.c('FancyText', {
    _displayText: "",
    _textElement: null,

    init: function() {
        this.requires("DOM")
        .bind("setTextCSS", function(cssValues) {
            if(!this._textElement) return;
            that = this;
            _.each(cssValues, function(cssVal, key) { 
                that._textElement.css(key, cssVal);
            });
        })
        .bind("removeText", function(cssValues) {
            if(!this._textElement) return;
            this._textElement.remove();
        });
    },

    FancyText: function(displayText) {
        this._displayText = displayText;
        this._textElement = $('<div style="position: relative;">' + displayText + '</div>');
        $(this._element).append(this._textElement);
        return this;
    }
});
 