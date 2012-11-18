SongView = Backbone.View.extend({

  template: _.template($('#song-template').html()),

  initialize: function(){
    this.render();
    this.canvas = this.$el.find('canvas')[0];
    this.canvas.width  = 640;
    this.canvas.height = 480;
    this.paused = true;
    this.context = this.canvas.getContext('2d');
    _.bindAll(this, 'handleKey');
    $(document).bind('keydown', this.handleKey);
    console.log(this.model);
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