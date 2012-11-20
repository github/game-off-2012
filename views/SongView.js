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
    this.sprites = new Array();
    this.sprites['marker'] = new Image();
    this.sprites['marker'].src = 'img/marker.png';
    this.queues = _.clone(this.model.get('queues'));
    this.active   = [[],[],[],[]];
    this.inactive = [[],[],[],[]];
    this.missed   = [[],[],[],[]];
    this.context = this.canvas.getContext('2d');
    _.bindAll(this, 'handleKey', 'animate', 'getNext', 'moveMarkers');
    $(document).bind('keydown', this.handleKey);
    window.setInterval(this.getNext, 10);
    window.setInterval(this.moveMarkers, 1000/170);
    this.animate();
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
            this.active[i].push({top:0, type:(i+1)});
          }
      }, this);
    }
  },

  moveMarkers: function () {
    if(!this.audio.paused){
      _.each(this.active, function(queue){
        _.each(queue, function(marker, i){
          if(marker.top > 400){
            this.missed.push(queue.splice(i, 1));
            this.score -= 500;
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

  check: function (queue) {
    if(this.active[queue].length > 0 && 
      this.active[queue][0].top < 260){
      console.log('early');
      this.score -= 500;
      this.combo = 0;
    }else if(this.active[queue].length > 0 && 
      this.active[queue][0].top < 330 &&
      this.active[queue][0].top > 260){
      this.inactive[queue].push(this.active[queue].shift());
      console.log('ok');
      this.score += 500;
      this.combo += 1;
    }else if(this.active[queue].length > 0 &&
      this.active[queue][0].top > 330 &&
      this.active[queue][0].top < 370){
      this.inactive[queue].push(this.active[queue].shift());
      console.log('Perfect!');
      this.score += 1000;
      this.combo += 1;
    }else if(this.active[queue].length > 0 &&
      this.active[queue][0].top > 370 && 
      this.active[queue][0].top < 400){
      this.inactive[queue].push(this.active[queue].shift());
      console.log('ok');
      this.score += 500;
      this.combo += 1;
    }
  },

  pause: function () {
    if(this.audio.paused){
      this.audio.play();
    }else{
      this.audio.pause();
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
        this.context.drawImage(this.sprites['marker'],
          (marker.type * 120), marker.top);
      }, this)
    }, this);
  },

  animate: function() {

    requestAnimationFrame(this.animate);
    this.clear();

    this.context.fillStyle = 'gray';
    this.context.fillRect(120, 0, 20, this.canvas.height);
    this.context.fillRect(240, 0, 20, this.canvas.height);
    this.context.fillRect(360, 0, 20, this.canvas.height);
    this.context.fillRect(480, 0, 20, this.canvas.height);
    this.context.fillRect(0, 335, this.canvas.width, 5);
    this.context.fillRect(0, 360, this.canvas.width, 5);
    
    this.renderMarker(this.active, 'green');
    this.renderMarker(this.inactive, 'darkgray');
    this.renderMarker(this.missed, 'red');

  },

  handleKey: function(event) {
    switch (event.keyCode) {
      case 70: this.check(0);
        break;
      case 71: this.check(1);
        break;
      case 72: this.check(2);
        break;
      case 74: this.check(3);
        break;
      case 80: this.pause();
        break;
    }
  }

});