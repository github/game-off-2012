MenuView = Backbone.View.extend({

  template: _.template($('#menu-template').html()),

  className: 'menu',

  events: {
    'hover li': 'select',
    'click li': 'choose'
  },

  initialize: function(){
    _.bindAll(this, 'handleKey');
    $(document).bind('keydown', this.handleKey);
    this.render();
  },

  render: function () { 
    $(this.el).html(this.template());
    return this;
  },

  select: function (event) {
    $('.selected').removeClass('selected');
    $(event.target).addClass('selected');
    game.events.trigger('playSound', 'click');
  },

  selectNext: function () {
    var next = $('.selected').next();
    if(next.length){
      $('.selected').removeClass('selected');
      next.addClass('selected');
    }
    game.events.trigger('playSound', 'click');
  },

  selectPrev: function () {
    var prev = $('.selected').prev();
    if(prev.length){
      $('.selected').removeClass('selected');
      prev.addClass('selected');
    }
    game.events.trigger('playSound', 'click');
  },

  choose: function () {
    game.events.trigger($('.selected').attr('id'));
  },

  handleKey: function(event) {
    switch (event.keyCode) {
      case 38: this.selectPrev();
        break;
      case 40: this.selectNext();
        break;
      case 13: this.choose();
        break;
    }
  },

  destroy: function() {
    $(document).unbind('keydown');
  }

});