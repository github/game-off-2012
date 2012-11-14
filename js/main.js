(function() {
  // rAF
  window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(f) {
        window.setTimeout(f,1e3/60);
      }
  }();


  window.mit = window.mit || {};

  var config = mit.config = {
    fork_count: 6
  };

  var ui = mit.ui = {
    body: $('body')
  };

  /*
  Basic Canvas Inits
  */

  var canvas = document.querySelector('#mindd_it');
  var ctx = canvas.getContext('2d');

  var W = canvas.width = ui.body.width();
  var H = canvas.height = ui.body.height();

  // Width x Height capped to 1000 x 500
  if (canvas.width > 1000) {
    W = canvas.width = 1000;
  }
  if (canvas.height > 500) {
    H = canvas.height = 500;
  }

  // Resizing Width/Height
  if (canvas.height < 500) {
    canvas.width = canvas.height * 1000/500;
  }
  if (canvas.width < 1000) {
    canvas.height = canvas.width * 500/1000;
  }

  var start_screen = document.querySelector('#start_screen');
  start_screen.style.width = canvas.width + 'px';
  start_screen.style.height = canvas.height + 'px';

  // Set Canvas Width/Height in Config
  mit.config.canvas_width = W;
  mit.config.canvas_height = H;

  // Gravity
  var gravity = mit.gravity = 0.2;

  // Velocity x,y
  var vx = 0;
  var vy = 0;

  // Velocity cap on either sides of the
  // number system.
  // 
  // You can console.log velocities in drawing methods
  // and from there decide what to set as the cap.
  var v_cap = 4;

  // Accelaration x,y
  var ax = 0;
  var ay = 0;

  // Flying up ?
  var flying_up = 0;


  // Key Events
  window.addEventListener('keydown', function(e) {

    switch (e.keyCode) {
      // Left
      case 37:
        ax = -0.1;
        break;

      // Right
      case 39:
        ax = 0.1;
        break;

      // Up
      case 38:
        ay = -0.4;
        break;

      // Down
      case 40:
        ay = 0.1;
        break;
    }

  }, false);

  window.addEventListener('keyup', function(e) {
    ax = 0;
    ay = 0;
  });

  // Game play on mouse clicks too!
  window.addEventListener('mousedown', function(e) {
    ay = -0.4;
    flying_up = 1;
  });

  window.addEventListener('mouseup', function(e) {
    ay = 0;
    flying_up = 0;
  });


  (function renderGame() {
    window.requestAnimationFrame(renderGame);

    ctx.clearRect(0, 0, W, H);
    mit.backgrounds.draw(ctx);

    if (flying_up)
      mit.pappu.updateFlyFrameCount();
    else
      mit.pappu.updateFlyFrameCount(0);

    // Draw Forks
    //window.mit.forks.drawForks(ctx, 6);
    // Draw Branches
    //window.mit.branches.drawBranches(ctx, 4);
    
    // Game over on reaching any boundary
    if (mit.pappu.hasReachedBoundary(W, H)) {
      return;
    }
    
    // Acceleration + Gravity
    // ay = ay + gravity;

    // Velocity
    if (
      (vy < v_cap && ay+gravity > 0) ||
      (vy > -v_cap && ay+gravity < 0)
      ) {

      vy += ay;
      vy += gravity;
    }

    // console.log(vy, ay)

    mit.pappu.x += vx;
    mit.pappu.y += vy;

    mit.pappu.draw(ctx);

  }());

}());