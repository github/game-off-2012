/**
* This file contains the player movement component.
*  
* Author: Fork It, We'll do it live!
*/

Crafty.c("Movement", {
    movementEnabled: true,
    _facing: [],
    _directions: [],
    _keys: {
        UP_ARROW: [0,-1],
        DOWN_ARROW: [0,1],
        RIGHT_ARROW: [1,0],
        LEFT_ARROW: [-1,0],
        W: [0,-1],
        S: [0,1],
        D: [1,0],
        A: [-1,0]
    },

    init: function() {
        this.requires('Keyboard, Moveable, CharacterInteractions');

        // Map the defined keys to the key codes
        for(var k in this._keys) {
          var keyCode = Crafty.keys[k] || k;
          this._keys[keyCode] = this._keys[k];
        }

        // Trigger a movement in the direction
        this.bind("KeyDown",function(e) {
            if(this._keys[e.key] && this.movementEnabled) {
                var direction = this._keys[e.key];
                // Add the direction to the movement stack
                this._directions.push(direction);
                // Tell the player to face a new direction
                this.trigger('NewDirection',direction);
            } 
            // If the action key is down, perform a push in the direction
            else if (this._keys[e.key] && this.isDown(gameBoard.actionKey)) {
                var direction = this._keys[e.key];
                this.trigger('Push',direction);
            }
            // Disable movement if the space key is down
            else if(e.key == gameBoard.actionKey) {
                this.movementEnabled = false;
                this.applyTrigger('Push');
                // Tell the player to play the grab animation
                this.trigger('GrabDirection',this._facing);
            }
            else if(e.key == gameBoard.removeKey) {
                this.trigger('RemoveBox',this._facing);
            }
            else if(e.key == gameBoard.colorKey) {
                this.trigger('TakeGiveColor',this._facing);
                this.trigger('GrabDirection',this._facing);
            }
        });

        // Reenable movement if space is up
        this.bind("KeyUp",function(e) {
            if(e.key == gameBoard.actionKey || e.key == gameBoard.colorKey) {
                if(e.key == gameBoard.actionKey) this.movementEnabled = true;
                if(!this.isDown(gameBoard.actionKey)) this.trigger('NewDirection',this._facing);
            }
            // Remove a direction key from the movement stack if necessary
            else if(this._keys[e.key]) {
                var that = this;
                var direction = this._keys[e.key];
                $.each(this._directions, function(i){
                    if(that._directions[i] === direction) that._directions.splice(i,1);
                });
            }
        });

        // Causes the player to move if their is a direction being pushed
        this.bind("EnterFrame",function(e) {
            if(this._directions.length > 0 && this.movementEnabled) {
                this.EntityMove(this._directions[this._directions.length - 1]);
                this._facing = this._directions[this._directions.length - 1];
            }
        });
    },
  
    applyTrigger: function(action) {
        for(var k in this._keys) {
            if(this.isDown(k)) {
                var direction = this._keys[k];
                this.trigger(action, direction);
                return;
            }
        }
    }
});
 
// This component contains the functions required for Phil to interact with the environment
Crafty.c("CharacterInteractions", {
    _holdingColor: null, // The color the player is holding

    init: function() {
        // Push performs pushing (and pulling which is just a push in the opposite direction, but dont tell anyone)
        this.bind("Push", function(direction) {
            if(direction != this._facing) {
                var moveDestX = this.x + direction[0] * gameBoard.tileSize;
                var moveDestY = this.y + direction[1] * gameBoard.tileSize;
                var canMove = this.canMoveToCoordinates(moveDestX, moveDestY);
                if(!canMove) return false;
          }

          // Figure out what direction we are pushing
          this._pushDestX = this.x + (this._facing[0] < 0 ? this._facing[0] : this._facing[0] * gameBoard.tileSize);
          this._pushDestY = this.y + (this._facing[1] < 0 ? this._facing[1] : this._facing[1] * gameBoard.tileSize);

          // Send the push command to anything in that space
          var collisionDetector = Crafty.e("2D, Collision").attr({ x: this._pushDestX, y: this._pushDestY, w: 1, h: 1 });
          entitiesHit = collisionDetector.hit("pushable");
          if(entitiesHit.length > 0) {
            var pushablePushed = entitiesHit[0].obj.push(direction);
            // Also move the player
            if(pushablePushed) {
                this.EntityMove([direction[0], direction[1], true]);
            }
          }
          collisionDetector.destroy();
        });
        
        this.bind("RemoveBox", function(direction) {
            // Figure out what direction we are pushing
            this._pushDestX = this.x + direction[0] * gameBoard.tileSize;
            this._pushDestY = this.y + direction[1] * gameBoard.tileSize;
          
            // Send the push command to anything in that space
            var collisionDetector = Crafty.e("2D, Collision").attr({ x: this._pushDestX, y: this._pushDestY, w: 1, h: 1 });
            entitiesHit = collisionDetector.hit("removable");
            if(entitiesHit.length > 0) {
              entitiesHit[0].obj.trigger('remove');
            }
            collisionDetector.destroy();
        });

        this.bind("TakeGiveColor", function(direction) {
            // Figure out what direction we are taking from
            this._pushDestX = this.x + direction[0] * gameBoard.tileSize;
            this._pushDestY = this.y + direction[1] * gameBoard.tileSize;

            // Send the take command to anything in that space
            var collisionDetector = Crafty.e("2D, Collision").attr({ x: this._pushDestX, y: this._pushDestY, w: 1, h: 1 });
            entitiesHit = collisionDetector.hit("ColorableBox");
            if(entitiesHit.length > 0) {
                // Give a color if Phil is holding one
                if(this._holdingColor) {
                    var colorTaken = entitiesHit[0].obj.giveColor(this._holdingColor);
                    this._holdingColor = colorTaken;
                }
                // Otherwise take the color
                else {
                    var colorTaken = entitiesHit[0].obj.takeColor();
                    if(colorTaken)
                        this._holdingColor = colorTaken;
                }
            }
            collisionDetector.destroy();
            this.trigger("ChangePlayerColor", this._holdingColor);
        });
        
        this.bind("ChangePlayerColor", function(color) {
            if(this.has("SpriteColor")) {
                if(color == null) {
                    this.spriteColor("#FFFFFF", 0.0);
                } else {
                    this.spriteColor(gameBoard.colorMap[color], 0.5);
                }
            }
        });
    }
 });
 