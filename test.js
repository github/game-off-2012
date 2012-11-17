/*
var stats = new Stats();
stats.setMode(0); //fps
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '570px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );
*/

var track = document.createElement('audio');
track.setAttribute('src', 'songs/PokeStar.mp3');
track.load()
track.addEventListener("load", function() {
  $(".duration span").html(audioElement.duration);
  $(".filename span").html(audioElement.src);
}, true);

var canvas = document.getElementById('canvas');
canvas.width  = 640;
canvas.height = 480;
var context = canvas.getContext('2d');
var blockHeight = 20;
var blockTop = -blockHeight;

var queue0 = [1400, 3000,7000, 6250, 9250, 11750, 12750, 15250, 16250, 17500, 
20250];
var queue1 = [5250, 7250, 10000, 11000, 13500, 14500, 18000, 20750];
var queue2 = [5750, 7500, 10500, 11000, 14000, 14500, 18500, 20750];
var queue3 = [3750, 8750, 9250, 12250, 12750, 15750, 16250, 19000, 20250];

var queues = [queue0, queue1, queue2, queue3];
var active = [[],[],[],[]];
var inactive = [[],[],[],[]];
var missed = [[],[],[],[]];

var score = 0;
var paused = true;

var forkSprite = new Image();
forkSprite.src = 'img/fork.png';

var getTime = function() {
  return Math.floor(track.currentTime*1000);
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

var pause = function() {
  paused = !paused;
  if(paused){
    track.pause();
    $('#status').html('PAUSED');
  }else{
    track.play();
    $('#status').empty();
  }
}

window.setInterval(function(){
  if(!paused){
    queues.forEach(function(queue, i) {
      if (queue[0] <= (getTime() + 1000)){
        queue.shift();
        var type = i + 1;
        active[i].push({top:0, type:type});
      }
    });
  }
},10);

window.setInterval(function(){
  if(!paused){
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
  }
}, 1000/170);

window.setInterval(function(){
  $('#time').html(getTime());
  $('#score').html(score);
}, 10);

function animate() {
  requestAnimationFrame(function () {
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
      context.drawImage(forkSprite, (target.type * 120), target.top);
    });
  });

  context.fillStyle = 'darkgray';

  inactive.forEach(function(array) {
    array.forEach(function(target) {
      context.drawImage(forkSprite, (target.type * 120), target.top);
    });
  });

  context.fillStyle = 'red';

  missed.forEach(function(array) {
    array.forEach(function(target) {
      context.drawImage(forkSprite, (target.type * 120), target.top);
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
  case 80:
    pause();
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