(function() {

  window.forks = window.forks || {};

  // Array of random forks
  var forks = [];

  var Fork = function() {
    this.x = 0;
    this.y = 0;

    // Width
    this.w = 0;
    // Height
    this.h = 0;
  };
  var flag = 0;
  var createRandomForks = function(ctx, count) {

    if (forks.length < count) {
      
      for (var i = 0; i < count - forks.length; i++) {
        var fork = new Fork();

        if (forks[forks.length-1]) {
          fork.x = forks[forks.length-1].x;
          fork.x += 150;

          fork.y = forks[forks.length-1].y;
        }
        else {
          fork.x = i*150;
          fork.y = 100;
        }

        forks.push(fork);
      }
    }

    // Loop over forks and draw each of them
    forks.forEach(function(fork, index) {
      if (fork.x < 0) {
        forks.splice(index, 1);
      }
      fork.x -= 2;

      ctx.beginPath();
      ctx.strokeStyle = 'blue';
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