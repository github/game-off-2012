(function() {

  // There will be only 1 Pappu

  mit.Pappu = {
    x: 50,
    y: 10,
    w: 50,
    h: 50,

    rotate_angle: 0,

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
        mit.Pappu.w = mit.Pappu.sprite.width;
        mit.Pappu.h = 60;

        // Sprite Frame Count
        mit.Pappu.max_fly_frame_count = 8;
        mit.Pappu.max_fly_frame_count--;

        // Sprite Frame Change Speed.
        // This will affect the flap speed.
        // 1.6 is the perfect value!
        mit.Pappu.change_per_frame = 1.6;

        // X Pos
        mit.Pappu.x = 33;
      };
    },

    draw: function(ctx) {
      var cur_sprite_frame = this.fly_frame_count / this.change_per_frame;
      
      if (utils.isInt(cur_sprite_frame)) {
        var source_y = cur_sprite_frame * 60;
      }

      else {
        //var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)%this.change_per_frame;

        // Ultra smooth animations
        var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)
        var source_y = old_sprite_frame * 60;
      }
      
      // console.log(cur_sprite_frame, source_x);

      // Rotation on Flying
      if (mit.flying_up) {
        if (this.rotate_angle > -15) {
          this.rotate_angle -= 2;
        }

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.translate(this.w/2, this.h/2);
        ctx.rotate(utils.toRadian(this.rotate_angle));

        ctx.drawImage(
          this.sprite,
          0,
          source_y,
          this.w,
          60,
          -this.w/2,
          -this.h/2,
          this.w,
          60
        );

        ctx.restore();
      }
      else {
        if (this.rotate_angle < 30) {
          this.rotate_angle += 2;
        }

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.translate(this.w/2, this.h/2);
        ctx.rotate(utils.toRadian(this.rotate_angle));
      
        ctx.drawImage(
          this.sprite,
          0,
          source_y,
          this.w,
          60,
          -this.w/2,
          -this.h/2,
          this.w,
          60
        );

        ctx.restore();
      }
    },

    drawStatic: function(ctx) {
      this.y = mit.Backgrounds.log_y-42;

      ctx.drawImage(
        this.sprite,
        0,
        0,
        this.w,
        60,
        this.x,
        this.y,
        this.w,
        60
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
      // Crossed Sides ?
      // `c` stands for crossed

      var ctop = (this.y < 0);
      var cbtm = (this.y > mit.H);
      var cleft = (this.x < 0);
      var crgt = (this.x > mit.W);

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