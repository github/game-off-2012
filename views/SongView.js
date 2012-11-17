SongView = Backbone.View.extend({

  template: _.template($('#song-template').html()),

  initialize: function(){
    this.render();
    this.canvas = this.$el.find('canvas')[0];
    this.canvas.width  = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext('2d');
    $(document).bind('keydown', this.logKey);
  },

  logKey: function(event) {
    console.log(event.type, event.keyCode);
  },

  render: function () { 
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }

});