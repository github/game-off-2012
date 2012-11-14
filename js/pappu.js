(function() {

  window.mit = window.mit || {};

  // There will be only 1 Pappu
  var pappu = {
    x: 50,
    y: 10,
    w: 50,
    h: 50,

    sprite: {},

    // Rate of sprite frame change
    // per animation frame.
    change_per_frame: 10,

    fly_frame_count: 0,
    max_fly_frame_count: 10,

    draw: function(ctx) {
      var cur_sprite_frame = this.fly_frame_count / this.change_per_frame;
      
      if (utils.isInt(cur_sprite_frame)) {
        var source_x = cur_sprite_frame * 48;
      }
      else {
        var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)%this.change_per_frame;
        var source_x = old_sprite_frame * 48;
      }

      console.log(cur_sprite_frame, source_x);
      
      ctx.drawImage(
        this.sprite,
        source_x,
        0,
        48,
        this.h,
        this.x,
        this.y,
        48,
        this.h
      );

      // During Testing Phase
      // ctx.fillStyle = 'red';
      // ctx.fillRect(this.x, this.y, this.w, this.h);
    },

    updateFlyFrameCount: function(count) {
      if (typeof count !== 'number') {
        this.fly_frame_count++;

        if (parseInt(this.fly_frame_count/this.change_per_frame) > this.max_fly_frame_count) {
          this.fly_frame_count = 0;
        }

        return;
      }

      this.fly_frame_count = count;
    },

    hasReachedBoundary: function(canvas_width, canvas_height) {
      var W = canvas_width;
      var H = canvas_height;

      // Crossed Sides ?
      // `c` stands for crossed

      var ctop = (this.y < 0);
      var cbtm = (this.y > H);
      var cleft = (this.x < 0);
      var crgt = (this.x > W);

      // return true if crossed any sides
      if (ctop || cbtm || cleft || crgt) {
        return true;
      }

      return false;
    }
  };

  // Initializing Pappu Sprite, lolzzz..!
  pappu.sprite = new Image();
  pappu.sprite.src = 'img/pappu.png';

  pappu.sprite.onload = function() {
    pappu.w = pappu.sprite.width;
    pappu.h = pappu.sprite.height;

    // Sprite Frame Count
    pappu.max_fly_frame_count = 6;
    pappu.max_fly_frame_count--;

    // Sprite Frame Change Speed.
    // This will affect the flap speed.
    pappu.change_per_frame = 3;
  };

  window.mit.pappu = pappu;

}());