(function() {

  window.mit = window.mit || {};

  // Array of random forks
  var forks = [];

  // Edges at which forks stand
  var edges = ['top', 'bottom'];

  var Fork = function() {
    this.x = 0;
    this.y = 0;

    // Width
    this.w = 0;
    // Height
    this.h = 0;

    // Edge on which the fork will stand on
    this.edge = 'bottom';
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
      pos.x += 200;

      pos.y = forks[forks.length-1].y;
    }
    else {
      pos.x = 1*200;
      pos.y = 200;
    }

    return pos;
  };
  
  var drawForks = function(ctx, count) {

    if (forks.length < count) {
      
      for (var i = 0; i < count - forks.length; i++) {
        var fork = new Fork();

        var pos = getRandomForkPos();

        fork.x = pos.x;
        fork.y = pos.y;

        // Setting a Random Edge
        fork.edge = edges[utils.randomNumber(0,1)];

        forks.push(fork);
      }
    }

    // Loop over forks and draw each of them
    forks.forEach(function(fork, index) {
      if (fork.x < 0) {
        forks.splice(index, 1);
      }
      fork.x -= 3;

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
      else if (fork.edge === 'bottom') {
        // ctx.lineTo(fork.x, mit.config.canvas_height);

        var fork_img = new Image();
        fork_img.src = 'img/fork_handle.png';
        ctx.drawImage(fork_img, fork.x, fork.y);
      }

      // ctx.stroke();
      // ctx.closePath();
    });
  };

  window.mit.forks = {
    drawForks: drawForks
  };

}());