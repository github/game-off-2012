(function() {

  // There will be only 1 Pappu

  mit.Pappu = {
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

    init: function() {
      // Initializing Pappu Sprite, lolzzz..!
      this.sprite = new Image();
      this.sprite.src = 'img/pappu.png';

      this.sprite.onload = function() {
        //pappu.w = pappu.sprite.width;
        mit.Pappu.w = 48;
        mit.Pappu.h = mit.Pappu.sprite.height;

        // Sprite Frame Count
        mit.Pappu.max_fly_frame_count = 6;
        mit.Pappu.max_fly_frame_count--;

        // Sprite Frame Change Speed.
        // This will affect the flap speed.
        mit.Pappu.change_per_frame = 5;

        // X Pos
        mit.Pappu.x = 35;
      };
    },

    draw: function(ctx) {
      var cur_sprite_frame = this.fly_frame_count / this.change_per_frame;
      
      if (utils.isInt(cur_sprite_frame)) {
        var source_x = cur_sprite_frame * 48;
      }
      else {
        var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)%this.change_per_frame;
        var source_x = old_sprite_frame * 48;
      }

      // console.log(cur_sprite_frame, source_x);
      
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

    drawStatic: function(ctx) {
      this.y = mit.Backgrounds.log_y-52;

      ctx.drawImage(
        this.sprite,
        0,
        0,
        48,
        this.h,
        this.x,
        mit.Backgrounds.log_y-52,
        48,
        this.h
      );
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
    },

    getBounds: function() {
      var bounds = {};

      bounds.start_x = this.x;
      bounds.start_y = this.y;
      bounds.end_x = this.x + this.w;
      bounds.end_y = this.y + this.h;

      return bounds;
    }
  };

  mit.Pappu.init();

}());