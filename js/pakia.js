(function() {
  
  window.mit = window.mit || {};

  var W, H;

  var types = [
    'sad', // pulls
    'happy', // pushes
    'angry' // kills
  ];

  var pakia_img = {};

  pakia_img['sad'] = new Image();
  pakia_img['sad'].src = 'img/sad_pakia.png';

  pakia_img['happy'] = new Image();
  pakia_img['happy'].src = 'img/happy_pakia.png';

  pakia_img['angry'] = new Image();
  pakia_img['angry'].src = 'img/angry_pakia.png';

  var Pakia = function() {

    // Default type will be angry
    this.type = 'angry';

    this.x;
    this.y;
    this.w;
    this.h;

    this.draw = function(ctx) {
      ctx.drawImage(pakia_img[this.type], this.x, this.y);
    };

    this.generateRandomPos = function() {
      this.x = mit.config.canvas_width/2 + 200;
      this.y = mit.config.canvas_height;
    };

    this.generateRandomVelocity = function() {
      this.vx = -8;
      this.vy = Math.random() * utils.randomNumber(-20,-10) -15;
    };
  };

  var pakias = [];

  var createPakias = function() {

    for (var i = 0; i < 3; i++) {
      var pakia = new Pakia();
      pakia.w = pakia_img['sad'].width;
      pakia.h = pakia_img['sad'].height;

      pakia.generateRandomPos();

      pakia.generateRandomVelocity();

      pakia.type = types[i];

      pakias.push(pakia);
    }
  };


  // Only 1 pakia at once, to make sure
  // gameplay is not terribly hard
  // as forks and branches have already
  // made it quite hard.
  var cur_pakia = false;


  var reflow = function(ctx) {
    if (!cur_pakia) {
      // Object by Reference!
      cur_pakia = pakias[utils.randomNumber(0,2)];
    }

    cur_pakia.vy += mit.gravity;

    cur_pakia.x += cur_pakia.vx;
    cur_pakia.y += cur_pakia.vy;
    // console.log(cur_pakia.x)

    // Reset positions
    if (cur_pakia.x + cur_pakia.w < 0) {
      cur_pakia.generateRandomPos();

      cur_pakia.generateRandomVelocity();

      cur_pakia = false;
    }
  };

  var repaint = function(ctx) {
    if (cur_pakia)
      cur_pakia.draw(ctx);
  };

  var render = function(ctx) {
    if (!pakias.length) {
      createPakias();
    }

    if (mit.score.toFixed(2) % 10 === 0 || cur_pakia) {
      mit.pakia.reflow(ctx);
      mit.pakia.repaint(ctx);
    }
  };


  window.mit.pakia = {
    reflow: reflow,
    repaint: repaint,
    render: render
  };

}());