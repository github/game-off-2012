(function() {

  mit.Pakia = function() {

    // Default type will be angry
    this.type = 'angry';

    this.x;
    this.y;
    this.w;
    this.h;

    this.draw = function(ctx) {
      ctx.drawImage(mit.PakiaUtils.pakia_img[this.type], this.x, this.y);
    };

    this.generateRandomPos = function() {
      this.x = mit.config.canvas_width/2 + 200;
      this.y = mit.config.canvas_height;
    };

    this.generateRandomVelocity = function() {
      this.vx = -12;
      this.vy = utils.randomNumber(-27,-20);
    };

    this.getBounds = function() {
      var bounds = {};

      bounds.start_x = this.x;
      bounds.start_y = this.y;
      bounds.end_x = this.x + this.w;
      bounds.end_y = this.y + this.h;

      return bounds;
    };
  };


  mit.PakiaUtils = {

    pakias: [],

    // Only 1 pakia at once, to make sure
    // gameplay is not terribly hard
    // as forks and branches have already
    // made it quite hard.
    cur_pakia: false,

    types: [
      'sad', // pulls
      'happy', // pushes
      'angry' // kills
    ],

    pakia_img: {
      sad: {},
      happy: {},
      angry: {}
    },

    init: function() {

      // Loading All Pakia Images

      this.pakia_img.sad = new Image();
      this.pakia_img.sad.src = 'img/sad_pakia.png';

      this.pakia_img.happy = new Image();
      this.pakia_img.happy.src = 'img/happy_pakia.png';

      this.pakia_img.angry = new Image();
      this.pakia_img.angry.src = 'img/angry_pakia.png';
    },

    createPakias: function() {

      for (var i = 0; i < 3; i++) {
        var pakia = new mit.Pakia();
        pakia.w = this.pakia_img.sad.width;
        pakia.h = this.pakia_img.sad.height;

        pakia.generateRandomPos();

        pakia.generateRandomVelocity();

        pakia.type = this.types[i];

        this.pakias.push(pakia);
      }
    },

    reflow: function(ctx) {

      if (!this.cur_pakia) {
        // Object by Reference!
        this.cur_pakia = this.pakias[utils.randomNumber(0,2)];
      }

      this.cur_pakia.vy += mit.gravity;

      this.cur_pakia.x += this.cur_pakia.vx;
      this.cur_pakia.y += this.cur_pakia.vy;
      // console.log(this.cur_pakia.x)

      // Reset positions
      if (this.cur_pakia.x + this.cur_pakia.w < 0) {
        this.cur_pakia.generateRandomPos();

        this.cur_pakia.generateRandomVelocity();
        
        this.cur_pakia = false;
      }
    },

    repaint: function(ctx) {
      if (this.cur_pakia)
        this.cur_pakia.draw(ctx);
    },

    render: function(ctx) {
      if (!this.pakias.length) {
        this.createPakias();
      }

      if (mit.score.toFixed(2) % 50 === 0 || this.cur_pakia) {
        this.reflow(ctx);
        this.repaint(ctx);
      }
    },

    checkCollision: function() {
      if (!this.cur_pakia)
        return;

      var pappu_bounds = mit.Pappu.getBounds();
      var pakia_bounds = this.cur_pakia.getBounds();

      if (utils.intersect(pappu_bounds, pakia_bounds)) {
        mit.gameOver();
      }
    }

  };


  mit.PakiaUtils.init();

}());