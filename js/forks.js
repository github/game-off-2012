(function() {

  window.forks = window.forks || {};

  var Fork = function() {
    this.x = 0;
    this.y = 0;

    // Width
    this.w = 0;
    // Height
    this.h = 0;
  };

  var createRandomForks = function(ctx, count) {
    var forks = [];

    for (var i = 0; i <= count; i++) {
      var fork = new Fork();
      fork.x = i*100;
      fork.y = i*100;

      forks.push(fork);
    }

    forks.forEach(function(fork) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.moveTo(fork.x, 0);
      ctx.lineTo(fork.x, fork.y);
      ctx.stroke();
      ctx.closePath();
    });
  };

  window.forks = {
    createRandomForks: createRandomForks
  };

}());