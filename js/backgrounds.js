(function() {

  mit.Backgrounds = {

    // Speeds and Velocities of Backgrounds
    common_bg_speed: 1,

    cloud_bg_move_speed: 4,
    cloud_bg_vx: 0,

    backtree_bg_move_speed: 5,
    backtree_bg_vx: 0,

    fronttree_bg_move_speed: 7,
    fronttree_bg_vx: 0,

    ground_bg_move_speed: 9,
    ground_bg_vx: 0,

    grass_bg_move_speed: 9,
    grass_bg_vx: 0,

    log_x: 40,
    log_y: 0,

    sky_gradient: {},

    init: function(ctx) {
      // Sky Gradient
      this.sky_gradient = ctx.createLinearGradient(0, 0, 0, mit.H);  
      this.sky_gradient.addColorStop(0, '#06c4f4');
      this.sky_gradient.addColorStop(1, '#7bd4f6');


      // Clouds
      this.cloud_img = new Image();
      this.cloud_img.src = 'img/clouds.png';

      this.cloud_img.width = mit.W;
      this.cloud_img.height = mit.H;


      // Back Trees
      this.back_trees_img = new Image();
      this.back_trees_img.src = 'img/back_trees.png';

      this.back_trees_img.width = mit.W;
      this.back_trees_img.height = mit.H;


      // Front Trees
      this.front_trees_img = new Image();
      this.front_trees_img.src = 'img/front_trees.png';

      this.front_trees_img.width = mit.W;
      this.front_trees_img.height = mit.H;


      // Ground
      this.ground_img = new Image();
      this.ground_img.src = 'img/ground.png';

      this.ground_img.width = mit.W;
      this.ground_img.height = mit.H;


      // Grass
      this.grass_img = new Image();
      this.grass_img.src = 'img/grass.png';

      this.grass_img.width = mit.W;
      this.grass_img.height = mit.H;


      // Log on which pappu sits
      this.log_img = new Image();
      this.log_img.src = 'img/log.png';
    },

    drawClouds: function(ctx) {
      ctx.drawImage(this.cloud_img, this.cloud_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(this.cloud_img, mit.W + this.cloud_bg_vx, 0, mit.W, mit.H);

      if (-this.cloud_bg_vx >= mit.W) {
        this.cloud_bg_vx = 0;
      }

      this.cloud_bg_vx -= this.cloud_bg_move_speed;
    },

    drawBackTrees: function(ctx) {
      ctx.drawImage(this.back_trees_img, this.backtree_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(this.back_trees_img, mit.W + this.backtree_bg_vx, 0, mit.W, mit.H);

      if (-this.backtree_bg_vx >= mit.W) {
        this.backtree_bg_vx = 0;
      }

      if (mit.game_started)
        this.backtree_bg_vx -= this.backtree_bg_move_speed * this.common_bg_speed;
    },

    drawFrontTrees: function(ctx) {
      ctx.drawImage(this.front_trees_img, this.fronttree_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(this.front_trees_img, mit.W + this.fronttree_bg_vx, 0, mit.W, mit.H);

      if (-this.fronttree_bg_vx >= mit.W) {
        this.fronttree_bg_vx = 0;
      }

      if (mit.game_started)
        this.fronttree_bg_vx -= this.fronttree_bg_move_speed * this.common_bg_speed;
    },

    drawGround: function(ctx) {
      ctx.drawImage(this.ground_img, this.ground_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(this.ground_img, mit.W + this.ground_bg_vx, 0, mit.W, mit.H);

      if (-this.ground_bg_vx >= mit.W) {
        this.ground_bg_vx = 0;
      }

      if (mit.game_started)
        this.ground_bg_vx -= this.ground_bg_move_speed * this.common_bg_speed;
    },

    drawGrass: function(ctx) {

      ctx.drawImage(this.grass_img, this.grass_bg_vx, 0, mit.W, mit.H);
      ctx.drawImage(this.grass_img, mit.W + this.grass_bg_vx, 0, mit.W, mit.H);

      if (-this.grass_bg_vx >= mit.W) {
        this.grass_bg_vx = 0;
      }

      if (mit.game_started)
        this.grass_bg_vx -= this.grass_bg_move_speed * this.common_bg_speed;
    },

    drawInitLog: function(ctx) {

      this.log_y = mit.H-(this.log_img.height+45);

      ctx.drawImage(this.log_img, this.log_x, this.log_y);

      if (mit.game_started) {
        this.log_x -= this.grass_bg_move_speed * this.common_bg_speed;
      }
    },

    // Draw Awesome Backgrounds
    // Backgrounds have been made for 1000x500 dimensions
    draw: function(ctx) {

      // Draw Linear Gradient for real/pure BG (sky/water)
      ctx.save();
      ctx.fillStyle = this.sky_gradient;
      ctx.fillRect(0, 0, mit.W, mit.H);
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
        this.log_x = 40;
      }

      // Draw Ground now!
      this.drawGround(ctx);
    }

  };

}());