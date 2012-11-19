(function() {

  window.mit = window.mit || {};

  // We're having lots of forks to
  // make gameplay a little harder
  // and incorporate ggo's required concepts.

  // But we'll also try to incorporate
  // 'branching' by adding some branches
  // at random spots. So let the forks
  // come, but sometimes there wont be forks,
  // but a single branch (from top to bottom).
  // 
  // The branches are gonna have a little hole
  // in between or some other random position
  // through which pappu will need to pass.
  // 
  // If it collides at some part other than
  // the hole, he'll decease.

  var branch_img = new Image();
  branch_img.src = 'img/branch.png';

  function Branch() {
    this.x = 0;
    this.y = 0;

    // Width
    this.w;
    // Height
    this.h;

    this.escape_x;
    this.escape_y;
    this.escape_w;
    this.escape_h;

    this.getBounds = function() {
      var bounds = {};

      bounds.start_x = this.x;
      bounds.start_y = this.y;
      bounds.end_x = this.x + this.w;
      bounds.end_y = this.y + this.h;

      return bounds;
    };

    this.getEscapeBounds = function() {
      var bounds = {};

      bounds.start_x = this.escape_x;
      bounds.start_y = this.escape_y;
      bounds.end_x = this.escape_x + this.escape_w;
      bounds.end_y = this.escape_y + this.escape_h;

      return bounds;
    };
  }

  var branches = [];

  /*
  This method will generate a random x/y
  position for the forks to start at.

  Based on the `fork.edge` we can draw
  the fork easily on the canvas edges.
  */
  var getRandomBranchPos = function() {
    // We have access to `branches` here
    var pos = {};

    if (branches[branches.length-1]) {
      pos.x = branches[branches.length-1].x;
      pos.x += utils.randomNumber(500, 2000);
    }
    else {
      // First
      pos.x = utils.randomNumber(2000, 2500);
    }

    return pos;
  };

  var draw = function(ctx, count) {

    if (branches.length < count) {
      
      for (var i = 0; i < count - branches.length; i++) {
        var branch = new Branch();

        var pos = getRandomBranchPos();
        branch.x = pos.x;
        branch.y = 0;

        branch.w = branch_img.width;
        branch.h = branch_img.height;

        // Escape Positions
        branch.escape_x = branch.x;
        branch.escape_y = branch.y + utils.randomNumber(0, branch_img.height-150);

        // Escape Area's Width/Height
        branch.escape_w = branch_img.width;
        branch.escape_h = 150;

        branches.push(branch);
      }
    }

    // console.log(branches);

    // Loop over branches and draw each of them
    branches.forEach(function(branch, index) {
      if (branch.x < 0) {
        branches.splice(index, 1);
      }
      branch.x -= mit.backgrounds.ground_bg_move_speed;

      // Escape Positions
      branch.escape_x = branch.x;

      ctx.drawImage(branch_img, branch.x, branch.y);

      // Draw Escapes
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'white';
      ctx.fillRect(
        branch.escape_x,
        branch.escape_y,
        branch.escape_w,
        branch.escape_h
      );
      ctx.restore();
    });
  };


  // Check collisions with branches
  var checkCollision = function() {
    // Get Pappu Bounds
    var pappu_bounds = mit.pappu.getBounds();

    // Get Nearest Branch's Top Part's Bounds
    var branch_bounds = branches[0].getBounds();

    if (utils.intersect(pappu_bounds, branch_bounds)) {
      // console.log(pappu_bounds, branch_bounds);

      // If the Escape Area intersects then pappu
      // can escape, else game over matey!
      var escape_bounds = branches[0].getEscapeBounds();

      if (!utils.intersect(pappu_bounds, escape_bounds)) {
        mit.gameOver();
      }

    }
  };


  window.mit.branches = {
    draw: draw,
    checkCollision: checkCollision
  };

}());