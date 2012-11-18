SongView = Backbone.View.extend({

  template: _.template($('#song-template').html()),

  initialize: function(){
    this.render();
    this.canvas = this.$el.find('canvas')[0];
    this.canvas.width  = 640;
    this.canvas.height = 480;
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
    this.animate();
  },

  render: function () { 
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
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
    this.context.fillStyle = 'green';

    _.each(this.active, function(array){
      _.each(array, function(target){
        this.context.drawImage(this.sprites['marker'], (target.type * 120), target.top);
      }, this)
    }, this);

    this.context.fillStyle = 'darkgray';

    _.each(this.inactive, function(array){
      _.each(array, function(target){
        this.context.drawImage(this.sprites['marker'], (target.type * 120), target.top);
      }, this)
    }, this);

    this.context.fillStyle = 'red';

    _.each(this.missed, function(array){
      _.each(array, function(target){
        this.context.drawImage(this.sprites['marker'], (target.type * 120), target.top);
      }, this)
    }, this);

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