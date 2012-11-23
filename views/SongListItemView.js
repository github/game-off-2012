SongListItemView = Backbone.View.extend({

  template: _.template($('#song-list-item-template').html()),

  tagName: 'li',

  className: 'song-list-item',

  events : {
  	'click' : function(){
  		game.events.trigger('loadSong', this.model);
  	}
  },

  initialize: function(){
    this.render();
  },

  render: function () {
    this.$el.append(this.template(this.model.toJSON()));
    return this;
  }
});