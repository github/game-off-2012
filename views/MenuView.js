MenuView = Backbone.View.extend({

  template: _.template($('#menu-template').html()),

  initialize: function(){
    this.render();
  },

  render: function () { 
    $(this.el).html(this.template());
    return this;
  }

});