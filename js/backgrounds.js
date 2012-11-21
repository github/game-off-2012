(function() {

  mit.Backgrounds = function() {

    // Speeds and Velocities of Backgrounds

    cloud_bg_move_speed: 2,
    cloud_bg_vx = 0;

    backtree_bg_move_speed: 3,
    backtree_bg_vx: 0,

    fronttree_bg_move_speed: 4,
    fronttree_bg_vx: 0,

    ground_bg_move_speed: 8,
    ground_bg_vx: 0,

    grass_bg_move_speed: 8,
    grass_bg_vx: 0,

    log_x: 0,
    log_y: 30,

    init: function() {
      // Lets LOLZ
    },

    drawClouds: function(ctx) {
      // Clouds
      var clouds = new Image();
      clouds.src = 'img/clouds.png';

      clouds.width = mit.W;
      clouds.height = mit.H;

      ctx.drawImage(clouds, this.cloud_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(clouds, mit.W + this.cloud_bg_vx, 0, mit.W, mit.H);

      if (-this.cloud_bg_vx >= mit.W) {
        this.cloud_bg_vx = 0;
      }

      this.cloud_bg_vx -= this.cloud_bg_move_speed;
    },

    drawBackTrees: function(ctx) {
      // Back Trees
      var back_trees = new Image();
      back_trees.src = 'img/back_trees.png';

      back_trees.width = mit.W;
      back_trees.height = mit.H;

      ctx.drawImage(back_trees, this.backtree_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(back_trees, mit.W + this.backtree_bg_vx, 0, mit.W, mit.H);

      if (-this.backtree_bg_vx >= mit.W) {
        this.backtree_bg_vx = 0;
      }

      if (mit.game_started)
        this.backtree_bg_vx -= this.backtree_bg_move_speed;
    },

    drawFrontTrees: function(ctx) {
      // Front Trees
      var front_trees = new Image();
      front_trees.src = 'img/front_trees.png';

      front_trees.width = mit.W;
      front_trees.height = mit.H;

      ctx.drawImage(front_trees, this.fronttree_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(front_trees, mit.W + this.fronttree_bg_vx, 0, mit.W, mit.H);

      if (-this.fronttree_bg_vx >= mit.W) {
        this.fronttree_bg_vx = 0;
      }

      if (mit.game_started)
        this.fronttree_bg_vx -= this.fronttree_bg_move_speed;
    },

    drawGround: function(ctx) {
      // Ground
      var ground = new Image();
      ground.src = 'img/ground.png';

      ground.width = mit.W;
      ground.height = mit.H;

      ctx.drawImage(ground, this.ground_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(ground, W + this.ground_bg_vx, 0, mit.W, mit.H);

      if (-this.ground_bg_vx >= mit.W) {
        this.ground_bg_vx = 0;
      }

      if (mit.game_started)
        this.ground_bg_vx -= this.ground_bg_move_speed;
    },

    drawGrass: function(ctx) {
      // Grass
      var grass = new Image();
      grass.src = 'img/grass.png';

      grass.width = mit.W;
      grass.height = mit.H;

      ctx.drawImage(grass, this.grass_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(grass, mit.W + this.grass_bg_vx, 0, mit.W, mit.H);

      if (-this.grass_bg_vx >= mit.W) {
        this.grass_bg_vx = 0;
      }

      if (mit.game_started)
        this.grass_bg_vx -= this.grass_bg_move_speed;
    },

    drawInitLog: function(ctx) {

      var log = new Image();
      log.src = 'img/log.png';

      this.log_y = mit.H-(log.height+45);

      ctx.drawImage(log, this.log_x, this.log_y);

      if (mit.game_started) {
        this.log_x -= this.grass_bg_move_speed;
      }
    },

    // Draw Awesome Backgrounds
    // Backgrounds have been made for 1000x500 dimensions
    var draw = function(ctx) {

      // Draw Linear Gradient for real/pure BG (sky/water)
      var gradient = ctx.createLinearGradient(0, 0, 0, H);  
      gradient.addColorStop(0, '#06c4f4');
      gradient.addColorStop(1, '#7bd4f6');
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Clouds
      this.drawClouds(ctx);
      
      // Back Small Trees
      this.drawBackTrees(ctx);

      // Front Big Trees
      this.drawFrontTrees(ctx);

      // Drawing the initial wood log on which
      // Pappu gonna sit and bask in the cool and cozy
      // environment.
      if (this.log_x+100 > 0) {
        this.drawInitLog(ctx);
      }
      else if (!mit.game_started) {
        this.log_x = 30;
      }

      // Draw Ground now!
      this.drawGround(ctx);
    }

  };

  // Initializations
  Backgrounds.init();

}());