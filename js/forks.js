(function() {

  window.mit = window.mit || {};

  var W, H;

  // Array of random forks
  var forks = [];

  // Edges at which forks stand
  var edges = ['top', 'btm'];

  // Dig Image
  var dig_img = new Image();
  dig_img.src = 'img/dig.png';

  var Fork = function() {
    this.x = 0;
    this.y = 0;

    // Width
    this.w = 0;
    // Height
    this.h = 0;

    // Edge on which the fork will stand on
    this.edge = 'btm';
  };

  /*
  How do we go about positioning forks exactly ?

  - Forks can appear on top or bottom edge.
  - Forks should vary in sizes, but should be
    mostly long to produce a harder gameplay.
  - Forks should appear at random distance.
    But there needs to be a range (or capping).
  - Every fork object should know what edge it
    is put on. This will help us calculate the
    exact height based on entire canvas
    height/width.
    This means, we only need the x/y position
    along with the edge, to put on the fork.
  */

  /*
  This method will generate a random x/y
  position for the forks to start at.

  Based on the `fork.edge` we can draw
  the fork easily on the canvas edges.
  */
  var getRandomForkPos = function() {
    // We have access to `forks` here
    var pos = {};

    if (forks[forks.length-1]) {
      pos.x = forks[forks.length-1].x;
      pos.x += 300;

      pos.y = forks[forks.length-1].y;
    }
    else {
      pos.x = 1*200;
      pos.y = 200;
    }

    return pos;
  };
  
  var draw = function(ctx, count) {

    if (forks.length < count) {
      
      for (var i = 0; i < count - forks.length; i++) {
        var fork = new Fork();

        var pos = getRandomForkPos();

        fork.x = pos.x;
        fork.y = pos.y;

        // Setting a Random Edge
        fork.edge = edges[utils.randomNumber(0,1)];

        // Setting the Dig Position
        if (fork.edge === 'btm') {
          var dig_rand = utils.randomNumber(3,5);

          fork.dig_x = dig_img.width / dig_rand;
          fork.dig_y = H - dig_img.height;
          // console.log(dig_img.width);
        }

        forks.push(fork);
      }
    }

    // Loop over forks and draw each of them
    forks.forEach(function(fork, index) {
      if (fork.x < 0) {
        forks.splice(index, 1);
      }
      fork.x -= mit.backgrounds.ground_bg_move_speed;

      // ctx.beginPath();
      // ctx.strokeStyle = 'blue';
      // ctx.lineWidth = 5;
      // ctx.moveTo(fork.x, fork.y);

      if (fork.edge === 'top') {
        // ctx.lineTo(fork.x, 0);

        var fork_img = new Image();
        fork_img.src = 'img/fork_handle.png';
        ctx.drawImage(fork_img, fork.x, 0);
      }
      else if (fork.edge === 'btm') {
        // ctx.lineTo(fork.x, mit.config.canvas_height);

        var fork_img = new Image();
        fork_img.src = 'img/fork_handle.png';
        ctx.drawImage(fork_img, fork.x, fork.y);
      }

      // ctx.stroke();
      // ctx.closePath();
    });
  };

  // Forks have black digs in grounds
  // This function will draw those

  var drawDigs = function(ctx) {
    W = mit.config.canvas_width;
    H = mit.config.canvas_height;

    // Loop over forks and draw digs for each of them

    forks.forEach(function(fork, index) {

      if (fork.edge === 'btm') {
        ctx.drawImage(dig_img, fork.x - fork.dig_x, fork.dig_y);
      }

    });
  };


  window.mit.forks = {
    draw: draw,
    drawDigs: drawDigs
  };

}());