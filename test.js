window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  window.oRequestAnimationFrame || 
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

/*
var stats = new Stats();
stats.setMode(0); //fps
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '570px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );
*/

var canvas = document.getElementById('canvas');
canvas.width  = 640;
canvas.height = 480;
var context = canvas.getContext('2d');
var blockHeight = 20;
var blockTop = -blockHeight;

var queue0 = [2000,2300,2600,2700,3000,4000,5000,10000,60000];
var queue1 = [5000];
var queue2 = [4000];
var queue3 = [7000];

var queues = [queue0, queue1, queue2, queue3];
var active = [[],[],[],[]];
var inactive = [[],[],[],[]];
var missed = [[],[],[],[]];

var start = new Date().getTime();
var score = 0;

var getTime = function() {
  return new Date().getTime() - start;
}

var check = function(queue) {
  if(active[queue][0].top < 310 && active[queue][0].top > 280){
    inactive[queue].push(active[queue].shift());
    console.log('ok');
    score += 500;
  }else if(active[queue][0].top > 310 && active[queue][0].top < 390){
    inactive[queue].push(active[queue].shift());
    console.log('Perfect!');
    score += 1000;
  }else if(active[queue][0].top > 390 && active[queue][0].top < 420){
    inactive[queue].push(active[queue].shift());
    console.log('ok');
    score += 500;
  }
}

window.setInterval(function(){
  queues.forEach(function(queue, i) {
    if (queue[0] <= (getTime() + 1000)){
      queue.shift();
      var type = i + 1;
      active[i].push({top:0, type:type});
    }
  });
},10);

window.setInterval(function(){
  active.forEach(function(array){
    array.forEach(function(target, i) {
      if(target.top > 420){
        missed.push(array.splice(i, 1));
        console.log('missed');
        score -= 500;
      }else{
        target.top +=2;
      }
    });
  });
  inactive.forEach(function(array){
    array.forEach(function(target, i) {
      if(target.top > canvas.height){
        array.splice(i, 1);
      }else{
        target.top +=2;
      }
    });
  });
  missed.forEach(function(array){
    array.forEach(function(target, i) {
      if(target.top > canvas.height){
        array.splice(i, 1);
      }else{
        target.top +=2;
      }
    });
  });
}, 1000/170);

window.setInterval(function(){
  $('#time').html(getTime());
  $('#score').html(score);
}, 10);

function animate() {
  requestAnimFrame(function () {
    animate();
  });

  //stats.begin();
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'gray';
  context.fillRect(120, 0, 20, canvas.height);
  context.fillRect(240, 0, 20, canvas.height);
  context.fillRect(360, 0, 20, canvas.height);
  context.fillRect(480, 0, 20, canvas.height);
  context.fillRect(0, 335, canvas.width, 5);
  context.fillRect(0, 360, canvas.width, 5);
  context.fillStyle = 'green';

  active.forEach(function(array) {
    array.forEach(function(target) {
      context.fillRect((target.type * 120), target.top, blockHeight, blockHeight);
    });
  });

  context.fillStyle = 'darkgray';

  inactive.forEach(function(array) {
    array.forEach(function(target) {
      context.fillRect((target.type * 120), target.top, blockHeight, blockHeight);
    });
  });

  context.fillStyle = 'red';

  missed.forEach(function(array) {
    array.forEach(function(target) {
      context.fillRect((target.type * 120), target.top, blockHeight, blockHeight);
    });
  });

  //stats.end();
}

window.onload = function() {
  animate();
};

window.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
  case 70:
    $('#f').addClass('pressed');
    check(0);
    break;
  case 71:
    $('#g').addClass('pressed');
    check(1);
    break;
  case 72:
    $('#h').addClass('pressed');
    check(2);
    break;
  case 74:
    $('#j').addClass('pressed');
    check(3);
    break;
  }
}, false);

window.addEventListener('keyup', function (event) {
  switch (event.keyCode) {
  case 70:
    $('#f').removeClass('pressed');
    break;
  case 71:
    $('#g').removeClass('pressed');
    break;
  case 72:
    $('#h').removeClass('pressed');
    break;
  case 74:
    $('#j').removeClass('pressed');
    break;
  }
}, false);

$(document).ready(function() {
  $('#start').click(function () {
    alert("begin");
  });
});