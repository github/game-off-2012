(function() {
  
  window.mit = window.mit || {};

  var W, H;

  var types = [
    'sad', // pulls
    'happy', // pushes
    'angry' // kills
  ];

  var sad_pakia_img = new Image();
  sad_pakia_img.src = 'img/sad_pakiya.png';

  var happy_pakia_img = new Image();
  happy_pakia_img.src = 'img/happy_pakiya.png';

  var angry_pakia_img = new Image();
  angry_pakia_img.src = 'img/angry_pakiya.png';

  var Pakia = function() {

    // Default type will be angry
    this.type = 'angry';

    this.x;
    this.y;
    this.w;
    this.h;

    // this.draw = function(ctx) {
    //  ctx.drawImage(sad_pakia_img, this.x, this.y);
    //};
  };

  var pakias = [];


  var reflow = function() {
    var pakia = new Pakia();
    pakia.w = sad_pakia_img.width;
    pakia.h = sad_pakia_img.height;

    pakia.x = mit.config.canvas_width/2 + 20;
    pakia.y = mit.config.canvas_height;

    pakia.ax = -5;
    pakia.ay = Math.random() * -1 -1;

    pakia.vx = -10;
    pakia.vy = Math.random() * -10 -14;

    pakias.push(pakia);
  };

  var repaint = function(ctx) {
    var pakia = pakias[0];

    //pakia.draw();
    //pakia.vx = pakia.ax;
    //pakia.vy = pakia.ay;
    pakia.vy += mit.gravity;

    pakia.x += pakia.vx;
    pakia.y += pakia.vy;

    ctx.drawImage(sad_pakia_img, pakia.x, pakia.y);
  };


  window.mit.pakia = {
    reflow: reflow,
    repaint: repaint
  };

}());