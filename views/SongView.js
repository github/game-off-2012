SongView = Backbone.View.extend({

  template: _.template($('#song-template').html()),

  className: 'song',

  initialize: function(){
    this.render();
    this.canvas = this.$el.find('canvas')[0];
    this.canvas.width  = 640;
    this.canvas.height = 480;
    this.audio = this.$el.find('audio')[0];
    this.audio.setAttribute('src', 'audio/songs/' + this.model.get('filename') + '.mp3');
    this.audio.load();
    this.score = 0;
    this.combo = 0;
    this.gameOver = false;
    this.finished = false;
    this.sprites = new Array();
    this.queues = _.clone(this.model.get('queues'));
    this.active   = [[],[],[],[]];
    this.inactive = [[],[],[],[]];
    this.missed   = [[],[],[],[]];
    if(localStorage[this.model.get('filename')] === undefined){
      localStorage[this.model.get('filename')] = 0;
    }
    this.context = this.canvas.getContext('2d');
    _.bindAll(this, 'handleKeyDown', 'handleKeyUp', 'animate', 'getNext', 'moveMarkers');
    $(document).bind('keydown', this.handleKeyDown);
    $(document).bind('keyup', this.handleKeyUp);
    this.nextInterval = window.setInterval(this.getNext, 10);
    this.moveInterval = window.setInterval(this.moveMarkers, 1000/224);
    this.endInterval = window.setInterval(_.bind(this.checkEnd, this), 1000);
    this.animate();
    window.setTimeout(_.bind(function(){
      this.$el.find('#ready').hide();
      this.$el.find('#go').show();
      this.audio.play();
    }, this), 1500);
    window.setTimeout(_.bind(function(){
      this.$el.find('#go').hide();
    }, this), 2000);
  },

  render: function () { 
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  getTime: function () {
    return Math.floor(this.audio.currentTime * 1000);
  },

  getNext: function () {
    $('#time').html(this.getTime());
    $('#score').html(this.score);
    $('#combo').html(this.combo);
    if(!this.audio.paused){
      _.each(this.queues, function(queue, i){
          if (queue[0] <= (this.getTime() + 1000)){
            queue.shift();
            this.active[i].push({top:-66, type:i});
          }
      }, this);
    }
  },

  clearAllIntervals: function() {
    window.clearInterval(this.nextInterval);
    window.clearInterval(this.moveInterval);
    window.clearInterval(this.endInterval);
  },

  checkGameOver: function () {
    if (this.score <= -2500){
      this.gameOver = true;
      this.audio.pause();
      this.clearAllIntervals();
      this.$el.find('#game-over').show();
    }
  },

  checkEnd: function () {
    if (this.getTime() >= this.model.get('end')){
      this.finished = true;
      this.audio.pause();
      this.clearAllIntervals();

      if(this.score > localStorage[this.model.get('filename')]){
        localStorage[this.model.get('filename')] = this.score;
        this.$el.find('#clear').append('<div id="new-highscore">New high score!</div>');
      }

      this.$el.find('#clear').show();
    }
  },

  moveMarkers: function () {
    if(!this.audio.paused){
      _.each(this.active, function(queue){
        _.each(queue, function(marker, i){
          if(marker.top > 440){
            this.missed.push(queue.splice(i, 1));
            this.score -= 500;
            this.checkGameOver();
            this.combo = 0;
          }else{
            marker.top += 2;
          }
        }, this);
      }, this);

      _.each(this.inactive, function(queue){
        _.each(queue, function(marker, i){
          if(marker.top > this.canvas.height){
            queue.splice(i, 1);
          }else{
            marker.top += 2;
          }
        }, this);
      }, this);

      _.each(this.missed, function(queue){
        _.each(queue, function(marker, i){
          if(marker.top > this.canvas.height){
            queue.splice(i, 1);
          }else{
            marker.top += 2;
          }
        }, this);
      }, this);
    }
  },

  //marker 66px tall, 382

  check: function (queue) {
    if(this.active[queue].length > 0 && 
      this.active[queue][0].top < 334){
      console.log('early');
      this.score -= 500;
      this.checkGameOver();
      this.combo = 0;
    }else if(this.active[queue].length > 0 && 
      this.active[queue][0].top < 334 &&
      this.active[queue][0].top > 366){
      this.inactive[queue].push(this.active[queue].shift());
      console.log('ok');
      this.score += 500;
      this.combo += 1;
    }else if(this.active[queue].length > 0 &&
      this.active[queue][0].top > 366 &&
      this.active[queue][0].top < 440){
      this.inactive[queue].push(this.active[queue].shift());
      console.log('Perfect!');
      this.score += 1000;
      this.combo += 1;
    }
  },

  pause: function () {
    if(!this.gameOver && !this.finished){
      this.$el.find('#pause').toggle();
      if(this.audio.paused){
        this.audio.play();
      }else{
        this.audio.pause();
      }
    }
  },

  clear: function () {
    this.context.clearRect(0, 0,
      this.canvas.width, this.canvas.height);
  },

  renderMarker: function (type, color) {
    this.context.fillStyle = color;
    _.each(type, function(queues){
      _.each(queues, function(marker){
        this.context.drawImage(markers[marker.type].img,
          (marker.type * 100 + 44), marker.top);
      }, this)
    }, this);
  },

  animate: function() {

    if(!this.gameOver && !this.finished){
      requestAnimationFrame(this.animate);

      this.clear();

      _.each(sprites, function(sprite){
        sprite.render(this.context);
      }, this)

      if(!this.audio.paused){    
        this.renderMarker(this.active, 'green');
        this.renderMarker(this.inactive, 'darkgray');
        this.renderMarker(this.missed, 'red');
      }
    }
  },

  handleKeyDown: function(event) {
    switch (event.keyCode) {
      case 70: this.check(0);
               sprites.octo_fork.set('current_frame', 1);
        break;
      case 71: this.check(1);
               sprites.octo_push.set('current_frame', 1);
        break;
      case 72: this.check(2);
               sprites.octo_pull.set('current_frame', 1);
        break;
      case 74: this.check(3);
               sprites.octo_clone.set('current_frame', 1);
        break;
      case 80: this.pause();
        break;
    }
  },

  handleKeyUp: function(event) {
    switch (event.keyCode) {
      case 70: sprites.octo_fork.set('current_frame', 0);
        break;
      case 71: sprites.octo_push.set('current_frame', 0);
        break;
      case 72: sprites.octo_pull.set('current_frame', 0);
        break;
      case 74: sprites.octo_clone.set('current_frame', 0);
        break;
    }
  }

});