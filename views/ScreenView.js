ScreenView = Backbone.View.extend({

  initialize: function(){
    _.bindAll(this, 'handleKey');
    $(document).bind('keydown', this.handleKey);
    this.render();
  },

  render: function () { 
    this.$el.html(this.template());
    return this;
  },

  handleKey: function(event) {
    switch (event.keyCode) {
      case 27: game.events.trigger('menu')
        break;
    }
  },

  destroy: function() {
    $(document).unbind('keydown');
  }

});