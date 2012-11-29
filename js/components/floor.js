/**
* Floor
* Entity for plain floor tile  
*/
Crafty.c('Floor', {
  init: function() {
    this.requires("2D, Canvas, grayFloor");
  },

  Floor: function() {
      return this;
  }
});

/**
* ColorFloor
* Applies a sprite for the colored floors
*/
Crafty.c('ColorFloor', {
    _colorString: "gray", // Default is gray

    init: function() {
        this.requires("2D, Canvas, Floor, " + this.colorComponentString())
        // Sets the color of the floor
        .bind('setFloorColor', function(color) {
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
    ColorFloor: function(color) {
        // Change the color of any attached fancy text
        this.trigger('setFloorColor', color);
        return this;
    },

    colorString: function() {
        return this._colorString;
    },

    colorComponentString: function() {
        return this._colorString + "Floor";
    }
});