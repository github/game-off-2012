Crafty.c("PlayerControls", {
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
    for(var k in this._keys) {
      var keyCode = Crafty.keys[k] || k;
      this._keys[keyCode] = this._keys[k];
    }

    this.bind("KeyDown",function(e) {
      if(this._keys[e.key]) {
        var direction = this._keys[e.key];
        this.trigger('Slide',direction);
        Crafty.trigger('Turn');
      }
    });
  }
});