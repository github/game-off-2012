(function() {

  window.mit = window.mit || {};

  var W, H;

  // Images

  // Fork handle
  var fork_img = new Image();
  fork_img.src = 'img/fork_handle.png';

  // Fork Head
  var fork_head_img = new Image();
  fork_head_img.src = 'img/fork_head.png';

  // Array of random forks
  var forks = [];

  // Edges at which forks stand
  var edges = ['top', 'btm'];

  // Dig Image
  var dig_img = new Image();
  dig_img.src = 'img/dig.png';

  var Fork = function() {
    // Handle Details
    this.x = 0;
    this.y = 0;

    // Width
    this.w = 0;
    // Height
    this.h = 0;


    // Head Details
    this.head_x = 0;
    this.head_y = 0;

    this.head_w = 0;
    this.head_h = 0;


    // Edge on which the fork will stand on
    this.edge = 'btm';

    // Get Handle Bounds
    this.getHandleBounds =  function() {
      var bounds = {};

      bounds.start_x = this.x;
      bounds.start_y = this.y;
      bounds.end_x = this.x + this.w;
      bounds.end_y = this.y + this.h;

      //console.log(bounds);
      return bounds;
    };

    // Get Head Bounds
    this.getHeadBounds = function() {
      var bounds = {};

      bounds.start_x = this.head_x;
      bounds.start_y = this.head_y;
      bounds.end_x = this.head_x + this.head_w;
      bounds.end_y = this.head_y + this.head_h;

      return bounds;
    };
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
    }
    else {
      pos.x = 1*200;
    }

    return pos;
  };
  
  var draw = function(ctx, count) {

    if (forks.length < count) {
      
      for (var i = 0; i < count - forks.length; i++) {
        var fork = new Fork();

        // Setting a Random Edge
        fork.edge = edges[utils.randomNumber(0,1)];

        // Setting the Dig Position
        if (fork.edge === 'btm') {
          var dig_rand = utils.randomNumber(3,5);

          fork.dig_x = dig_img.width / dig_rand;
          fork.dig_y = H - dig_img.height;
          // console.log(dig_img.width);

          fork.y = 200 + utils.randomNumber(0,100);
          fork.y += fork_head_img.height;
        }

        if (fork.edge === 'top') {
          fork.y = 0 - utils.randomNumber(0,100);
          fork.y -= fork_head_img.height;
        }

        var pos = getRandomForkPos();
        fork.x = pos.x;

        // Height and Width
        fork.w = fork_img.width;
        fork.h = fork_img.height;

        forks.push(fork);
      }
    }

    // Loop over forks and draw each of them
    forks.forEach(function(fork, index) {
      if (fork.x < 0) {
        forks.splice(index, 1);
      }
      fork.x -= mit.backgrounds.ground_bg_move_speed;

      // Check Collisions with pappu
      // mit.forks.checkCollision();

      // ctx.beginPath();
      // ctx.strokeStyle = 'blue';
      // ctx.lineWidth = 5;
      // ctx.moveTo(fork.x, fork.y);

      if (fork.edge === 'top') {
        // ctx.lineTo(fork.x, 0);

        // Top forks need flippin
        ctx.save();
        ctx.translate(fork.x, fork.y);
        ctx.translate(fork_img.width/2, fork_img.height/2);
        ctx.rotate( utils.toRadian(180) );
        ctx.drawImage(fork_img, -fork_img.width/2, -fork_img.height/2);
        ctx.restore();


        fork.head_x = fork.x-fork_head_img.width/8;
        fork.head_y = fork.y+fork_img.height;

        fork.head_w = fork_head_img.width;
        fork.head_h = fork_head_img.height;

        // Draw Fork Head
        ctx.save();
        ctx.translate(fork.head_x, fork.head_y);
        ctx.translate(fork_head_img.width/2, fork_head_img.height/2);
        ctx.rotate( utils.toRadian(180) );
        ctx.drawImage(fork_head_img, -fork_head_img.width/2, -fork_head_img.height/2);
        ctx.restore();
      }
      else if (fork.edge === 'btm') {
        // ctx.lineTo(fork.x, mit.config.canvas_height);

        ctx.drawImage(fork_img, fork.x, fork.y);


        fork.head_x = fork.x-fork_head_img.width/5;
        fork.head_y = fork.y-fork_head_img.height;

        fork.head_w = fork_head_img.width;
        fork.head_h = fork_head_img.height;

        // Draw Fork Head
        ctx.save();
        ctx.translate(fork.head_x, fork.head_y);
        ctx.translate(1* fork_head_img.width/2, 1* fork_head_img.height/2);
        ctx.scale(-1,1);
        ctx.drawImage(
          fork_head_img,
          1* -fork_head_img.width/2,
          1* -fork_head_img.height/2
        );
        ctx.restore();
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


  // Check Fork Collision
  var checkCollision = function() {
    // Get Pappu Bounds
    var pappu_bounds = mit.pappu.getBounds();

    // Get Nearest Fork's Handle's Bounds
    var fork_bounds = forks[0].getHandleBounds();
    
    // Check whether pappu collided with the
    // fork handle or not.
    if (utils.intersect(pappu_bounds, fork_bounds)) {
      // console.log(pappu_bounds, fork_bounds);
      mit.gameOver();
    }


    // We'll have to check for collision with forks
    // If there's a collision pappu will be pushed!
    var fork_head_bounds = forks[0].getHeadBounds();

    if (mit.forks.had_head_collision) {
      mit.forks.had_head_collision = false;

      mit.vy += -mit.forks.last_push;
    }

    // Check whether pappu collided with the
    // fork head or not.
    if (utils.intersect(pappu_bounds, fork_head_bounds)) {
      mit.forks.had_head_collision = true;

      if (forks[0].edge === 'top') {
        mit.forks.last_push = +forks[0].head_h;
      }
      else {
        mit.forks.last_push = -forks[0].head_h;
      }

      mit.vy += mit.forks.last_push;
      // console.log(pappu_bounds, fork_head_bounds);
      // console.log(mit.vy);
    }
  };


  window.mit.forks = {
    draw: draw,
    drawDigs: drawDigs,
    checkCollision: checkCollision,
    had_head_collision: false
  };

}());