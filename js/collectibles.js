(function() {

  /*
  We'll have some collectibles:

  - Ones that give 50, 100, 500, 1000 points.
    50 and 100 points one will also prevent
    pakias from comin for sometime.

  - One to clone pappu that'll kill all
    forks, branches, pakias.
  */
  
  mit.Collectible = function() {

    // x/y pos
    this.x;
    this.y;

    // width/height
    this.w;
    this.h;

    this.getBounds = function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };


    this.draw = function(ctx) {
      ctx.fillRect(
        this.x,
        this.y,
        this.w,
        this.h
      );

      return;
    };
  };


  mit.CollectibleUtils = {

    collecs: [],

    count: 2,

    types: ['point', 'clone'],

    sub_types: {
      point: [50, 100, 500, 1000]
    },

    init: function() {

    },

    getRandomPos: function() {
      var pos = {};

      var last = this.collecs[this.collecs.length - 1];

      if (last) {
        pos.x = last.x + utils.randomNumber(1000, 1500);
      }
      else {
        pos.x = utils.randomNumber(2000, 3000);
      }

      pos.y = utils.randomNumber(100, mit.H-100);

      // Check Positioning with forks
      var forks = mit.ForkUtils.forks;

      if (forks.length) {
        forks.forEach(function(fork) {
          if (Math.abs(pos.x - fork.x) < 300)
            pos.x = fork.x + 300;
        });
      }

      // Check Positioning with branches
      var branches = mit.BranchUtils.branches;

      if (branches.length) {
        branches.forEach(function(branch) {
          if (Math.abs(pos.x - branch.x) < 300)
            pos.x = branch.x + 300;
        });
      }

      return pos;
    },

    create: function() {
      var count = this.count - this.collecs.length;
      var collec;

      for (var i = 0; i < count; i++) {
        collec = new mit.Collectible();

        var pos = this.getRandomPos();

        collec.x = pos.x;
        collec.y = pos.y;

        collec.w = 30;
        collec.h = 30;

        this.collecs.push(collec);
      }
    },

    draw: function(ctx) {

      var self = this;

      self.create();

      self.collecs.forEach(function(collec, i) {
        if (collec.x < 0) {
          // Moved off the left edge
          var pos = self.getRandomPos();

          collec.x = pos.x;
          collec.y = pos.y;
        }

        collec.x -= mit.Backgrounds.ground_bg_move_speed;

        collec.draw(ctx);
      });

      return;
    },

    checkCollision: function() {
      var first_collec = this.collecs[0],
          // Get Pappu Bounds
          pappu_bounds = mit.Pappu.getBounds(),
          // Get Nearest Collectible Bounds
          collec_bounds = first_collec.getBounds();

      if (utils.intersect(pappu_bounds, collec_bounds)) {
        // Pappu haz collected!

        var pos = this.getRandomPos();

        first_collec.x = pos.x;
        first_collec.y = pos.y;
      }

      return;
    }

  };

  mit.CollectibleUtils.init();

}());