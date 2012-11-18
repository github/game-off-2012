SongView = Backbone.View.extend({

  template: _.template($('#song-template').html()),

  initialize: function(){
    this.render();
    this.canvas = this.$el.find('canvas')[0];
    this.canvas.width  = 640;
    this.canvas.height = 480;
    this.audio = this.$el.find('audio')[0];
    this.audio.setAttribute('src', 'audio/' + this.model.get('filename') + '.mp3');
    this.audio.load();
    this.paused = true;
    this.sprites = new Array();
    this.sprites['marker'] = new Image();
    this.sprites['marker'].src = 'img/marker.png';
    this.queues = _.clone(this.model.get('queues'));
    this.active   = [[],[],[],[]];
    this.inactive = [[],[],[],[]];
    this.missed   = [[],[],[],[]];
    this.context = this.canvas.getContext('2d');
    _.bindAll(this, 'handleKey', 'animate');
    $(document).bind('keydown', this.handleKey);
    window.setInterval(this.scanQueues, 10);
    this.animate();
  },

  render: function () { 
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },

  getTime: function () {
    return Math.floor(this.audio.currentTime * 1000);
  },

  scanQueues: function () {
    if(!this.paused){
      _.each(this.queues, function(queue, i){
          if (queue[0] <= (this.getTime() + 1000)){
            queue.shift();
            //var type = i + 1;
            .active[i].push({top:0, type:(i+1)});
        }
      }, this);
    }
  },

  check: function (queue) {
    console.log(queue);
  },

  pause: function () {
    this.paused = !this.paused;
    console.log(this.paused);
    if(this.paused){

    }else{

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
        this.context.drawImage(this.sprites['marker'], (marker.type * 120), marker.top);
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