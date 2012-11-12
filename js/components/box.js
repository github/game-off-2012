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

  PushableBox: function() {
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
        return this.EntityMove(direction);
    },
    
    PushableBox: function() {
        return this;
    }
});

/**
* Removable Box
* Adds a listener to the push trigger.  
*/
Crafty.c('RemovableBox', {
  init: function() {
    this.requires("removable, Box")
      .bind('remove', function() {
        this.removeNeighbors(this, []);
      });
  },
  removeNeighbors:function(block, touched) {
    var neighbors = block.getNeighbors('removable');
    for(var i = 0; i < neighbors.length; i++) {
      if (-1 === (jQuery.inArray(neighbors[i].x + "," + neighbors[i].y, touched))) {
        touched.push(neighbors[i].x + "," + neighbors[i].y);
        this.removeNeighbors(neighbors[i], touched);
      }
    }
    block.destroy();
  },
  
  RemovableBox: function() {
      return this;
  }
});
