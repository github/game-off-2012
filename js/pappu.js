(function() {

  window.mit = window.mit || {};

  // There will be only 1 Pappu
  var pappu = {
    x: 50,
    y: 10,
    w: 50,
    h: 50,

    sprite: {},

    fly_frame_count: 0,
    max_fly_frame_count: 10,

    draw: function(ctx) {
      if (parseFloat(this.fly_frame_count%11) === this.fly_frame_count%11) {
        var source_x = this.fly_frame_count%11 * 48;
      }
      else {
        var source_x = parseInt(this.fly_frame_count/11)%11 * 48;
      }
      
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

        if (this.fly_frame_count%11 > this.max_fly_frame_count) {
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

    pappu.max_fly_frame_count = 6;
    pappu.max_fly_frame_count--;
  };

  window.mit.pappu = pappu;

}());