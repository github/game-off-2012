(function() {

  window.mit = window.mit || {};

  // There will be only 1 Pappu
  var pappu = {
    x: 50,
    y: 10,
    w: 50,
    h: 50,

    sprite: {},

    draw: function(ctx) {
      ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);

      // During Testing Phase
      // ctx.fillStyle = 'red';
      // ctx.fillRect(this.x, this.y, this.w, this.h);
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
  };

  window.mit.pappu = pappu;

}());