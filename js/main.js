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
    body: $('body'),
    score_board: $('#score_board'),
    start_screen: $('#start_screen'),
    start_game: $('#start_game'),
    tweet: $('#tweet'),
    fb: $('#fb')
  };

  /*
  Basic Canvas Inits
  */

  // Main Canvas

  var canvas = document.querySelector('#game_main');
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

  // BG Canvas
  var bg_canvas = document.querySelector('#game_bg');
  var bg_ctx = bg_canvas.getContext('2d');

  bg_canvas.width = canvas.width;
  bg_canvas.height = canvas.height;


  /*
    Game Start Screen and Lolz
  */
  mit.game_started = 0;
  mit.game_over = 0;
  mit.start_btn_clicked = 0;

  ui.start_screen.css('width', canvas.width + 'px');
  ui.start_screen.css('height', canvas.height + 'px');

  // Start Button
  ui.start_game.on('mousedown', function() {
    ui.start_screen.fadeOut();

    mit.start_btn_clicked = 1;
    mit.game_started = 0;

    mit.pappu.drawStatic(ctx);
    mit.ax = 0; mit.ay = 0;
    mit.vx = 0; mit.vy = 0;

    // reset score
    mit.score = 0;

    return false;
  });


  mit.score = 0;

  ui.score_board.css('width', canvas.width + 'px');
  ui.score_board.css('height', canvas.height + 'px');


  // Set Canvas Width/Height in Config
  mit.config.canvas_width = mit.W = W;
  mit.config.canvas_height = mit.H = H;

  // Gravity
  mit.gravity = 0.7;

  // Velocity x,y
  mit.vx = 0;
  mit.vy = 0;

  // Velocity cap on either sides of the
  // number system.
  // 
  // You can console.log velocities in drawing methods
  // and from there decide what to set as the cap.
  var v_cap = 7;

  // Accelaration x,y
  mit.ax = 0;
  mit.ay = 0;

  // Flying up ?
  var flying_up = 0;


  // Key Events
  window.addEventListener('keydown', function(e) {
    if (!mit.start_btn_clicked)
      return;

    switch (e.keyCode) {
      // Left
      //case 37:
      //  mit.ax = -0.4;
      //  break;

      // Right
      //case 39:
      //  mit.ax = 0.4;
      //  break;

      // Up
      case 38:
        mit.ay = -1.0;
        break;

      // Down
      case 40:
        mit.ay = 1.0;
        break;
    }

  }, false);

  window.addEventListener('keyup', function(e) {
    if (!mit.start_btn_clicked)
      return;

    mit.ax = 0;
    mit.ay = 0;
  }, false);

  // Game play on mouse clicks too!
  window.addEventListener('mousedown', function(e) {
    if (!mit.start_btn_clicked)
      return;

    if (!mit.game_started)
      mit.game_started = 1;

    mit.ay = -1.5;
    flying_up = 1;
  }, false);

  window.addEventListener('mouseup', function(e) {
    if (!mit.start_btn_clicked)
      return;

    mit.ay = 0;
    flying_up = 0;
  }, false);


  /*
    Performing some game over tasks
  */
  mit.gameOver = function() {
    ui.start_screen.fadeIn();
    ui.start_game.html('re-start');
    ui.tweet.html('tweet score');
    ui.fb.html('post on fb');

    mit.game_over = 1;
    mit.start_btn_clicked = 0;
  };


  (function renderGame() {
    window.requestAnimationFrame(renderGame);

    // Draw Backgrounds on BG Canvas
    mit.Backgrounds.draw(bg_ctx);

    ctx.clearRect(0, 0, W, H);

    // Draw Digs (holds forks)
    // I am fine without Digs, but Kushagra
    // just WANTS me to do this extra work :/
    mit.ForkUtils.drawDigs(ctx);

    // Draw Grass on Main Canvas
    mit.Backgrounds.drawGrass(ctx);

    if (flying_up)
      mit.pappu.updateFlyFrameCount();
    else
      mit.pappu.updateFlyFrameCount(0);

    
    // Game over on reaching any boundary
    if (mit.pappu.hasReachedBoundary(W, H)) {
      // Performing some game over tasks
      mit.gameOver();
      return;
    }

    //mit.ForkUtils.draw(ctx);
    //mit.BranchUtils.draw(ctx, 4);

    //mit.ForkUtils.checkCollision();

    // Send over Pakias (Enemies)
    // mit.pakia.render(ctx);

    if (mit.game_started) {

      // Draw Forks
      mit.ForkUtils.draw(ctx);
      // Draw Branches
      mit.BranchUtils.draw(ctx);

      // Check Collisions with pappu
      mit.ForkUtils.checkCollision();
      mit.BranchUtils.checkCollision();

      // Send over Pakias (Enemies)
      if (mit.score > 9)
        mit.PakiaUtils.render(ctx);

      // Update score
      mit.score = mit.score + 0.2;
      ui.score_board.text(parseInt(mit.score));

      // Acceleration + Gravity
      // mit.ay = mit.ay + mit.gravity;
      
      // Velocity
      if (
        (mit.vy < v_cap && mit.ay+mit.gravity > 0) ||
        (mit.vy > -v_cap && mit.ay+mit.gravity < 0)
        ) {

        // console.log(mit.ay);
        mit.vy += mit.ay;
        mit.vy += mit.gravity;
      }

      // console.log(vy, ay)

      mit.pappu.x += mit.vx;
      mit.pappu.y += mit.vy;
    
      mit.pappu.draw(ctx);
    }
    else {
      mit.pappu.drawStatic(ctx);
    }

  }());

}());