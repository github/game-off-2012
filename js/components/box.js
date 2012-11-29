/**
* Box
* Adds a listener to the push trigger.  
*/
Crafty.c('Box', {
  init: function() {
    this.requires("solid, Moveable");
  },
  
  getNeighbors: function(type) {
    var neighbors = [];
    var directions = [[1,0], [0,1], [-1,0], [0,-1]]
    var collisionDetector = null;
    
    for (var i = 0; i < directions.length; i++) {
      collisionDetector = Crafty.e("2D, Collision").attr({ x: (this.x+directions[i][0]*gameBoard.tileSize), y: this.y+directions[i][1]*gameBoard.tileSize, w: 1, h: 1 });
      entitiesHit = collisionDetector.hit(type);
      if (entitiesHit.length > 0)
        neighbors.push(entitiesHit[0].obj);
    }
    
    return neighbors;
  },

  Box: function() {
      return this;
  }
});

/**
* Pushable Box
* Adds a listener to the push trigger.  
*/
Crafty.c('PushableBox', {
    init: function() {
        this.requires("pushable, Box")
    },
    
    push: function(direction) {
        // Can only push to same color squares if its a colored box
        if(this.has("ColorBox") && !this.canMoveToColorTile(direction))
            return false;

        return this.EntityMove(direction);
    },
    
    PushableBox: function() {
        return this;
    }
});

/**
* Finishable Box
* Adds a listener to the push trigger.  
*/
Crafty.c('FinishableBox', {
    init: function() {
      
    },
    
    finish: function() {
        console.log(this.nextMapKey);
    },
    
    FinishableBox: function() {
        return this;
    }
});

/**
* Removable Box
* This is a box that can remove itself and its neighbors of the same color
* Requires ColorBox as it depends on the colors to determine what to remove
*/
Crafty.c('RemovableBox', {
    init: function() {
        this.requires("removable, Box, ColorBox, FancyText")
        .bind('remove', function() {
            this.removeNeighbors();
        });

        // Initiate inner text to display the number
        // of blocks needed for removable.  Not sure if we want this?
        this.FancyText("3");
        this.trigger('setTextCSS', {
            "text-align": "center",
            "font-size": "2em",
            top: "-2px"
        });
    },

    // Removes the itself and its neighbors if TWO or more are touching
    // TODO: The number of blocks touching should be configurable, probably as
    // an input ot the constructor
    removeNeighbors:function() {
        var neighborsToCheck = [];    // Stack of neighbors to check
        var removableNeighbors = {};  // Blocks that are confirmed for removal
        // First add itself to the confirmed blocks for removal
        removableNeighbors[this.x + "," + this.y] = this;
        // Then add the immediate neighbors to the ones to check
        neighborsToCheck = neighborsToCheck.concat(this.getNeighbors('removable'));
        
        // While there are still blocks to check, check to see if we already checked it.
        // If not, add the neighbor of that block to the list to check
        while(neighborsToCheck.length > 0) {
            var neighbor = neighborsToCheck.pop();
            // Skip it if we've already checked it, if its not a color, or its not the same color
            if(removableNeighbors[neighbor.x + "," + neighbor.y] 
                || !neighbor.has("ColorBox") 
                || neighbor.colorString() != this.colorString())
                continue;
            else {
                removableNeighbors[neighbor.x + "," + neighbor.y] = neighbor;
                neighborsToCheck = neighborsToCheck.concat(neighbor.getNeighbors('removable'));
            }
        }

        // If the number of removable blocks is >= 3 then remove them
        if(_.size(removableNeighbors) > 2) {
            _.each(removableNeighbors, function(neighborToDestroy, key){ 
                neighborToDestroy.destroy();
            });
        }
    },
  
    RemovableBox: function() {
        return this;
    }
});

/**
* Box
* Applies a sprite for the colored boxes
*/
Crafty.c('ColorBox', {
    _colorString: "white", // Default is white

    init: function() {
        this.requires("Box, " + this.colorComponentString())
        // Sets the color of the box
        .bind('setBoxColor', function(color) {
            this.removeComponent(this.colorComponentString(), false);
            this._colorString = color;
            this.addComponent(this.colorComponentString());

            // Change the color of any attached fancy text
            this.trigger('setTextCSS', {
                color: gameBoard.colorTextMap[color]
            });
        });
    },

    // Constructer takes a string that represents a color and applies the sprite
    // Choices so far are "white", "red", "blue", "purple"
    ColorBox: function(color) {
        // Change the color of any attached fancy text
        this.trigger('setBoxColor', color);
        return this;
    },

    colorString: function() {
        return this._colorString;
    },

    colorComponentString: function() {
        return this._colorString + "Box" + (this.has("PushableBox") ? "" : "Unmovable" );
    },
    
    canMoveToColorTile: function(direction) {
        // Figure out our destination
        var xLoc = this.x + direction[0] * gameBoard.tileSize;
        var yLoc = this.y + direction[1] * gameBoard.tileSize;
    
        var collisionDetector = Crafty.e("2D, Collision").attr({ x: xLoc, y: yLoc, w: 1, h: 1 });
        entitiesHit = collisionDetector.hit("ColorFloor");
        if(entitiesHit.length > 0) {
            collisionDetector.destroy();
            if(entitiesHit[0].obj.colorString() != this.colorString())
                return false;
        }
        collisionDetector.destroy();
        return true;
    }
});


/**
* ColorableBox
* This is a box that can have color taken or given to it
*/
Crafty.c('ColorableBox', {
    _wasRemovable: false,
    _transferableColor: null,

    init: function() {
        this.requires("ColorBox");
        this.trigger('setBoxColor', "white");
    },

    // Constructor takes a color
    ColorableBox: function(color) {
        this._transferableColor = color;
        this.trigger('setBoxColor', color);
        return this;
    },

    // Take a color from the box.  This will set the box to white
    // Returns the color taken, or false if no color
    takeColor: function() {
        if(this._transferableColor) {
            var oldColor = this.colorString();
            this.trigger('setBoxColor', "white");
            this.trigger('removeText');
            if(this.has("RemovableBox")) {
                this._wasRemovable = true;
                this.removeComponent("RemovableBox", false);
            } else
                this._wasRemovable = false;
            this._transferableColor = null;
            return oldColor;
        }
        else
            return false;
    },

    // Give a color to the box
    // Returns the old color of the box (null if none)
    giveColor: function(color) {
        var oldColor = this._transferableColor;
        this.trigger('removeText');
        if(this._wasRemovable || this.has("RemovableBox"))
            this.addComponent("RemovableBox");
        this.trigger('setBoxColor', color);
        this._transferableColor = color;
        return oldColor;
    }
});
