SongsView = ScreenView.extend({

    template: _.template($('#songs-template').html()),

    className: 'songs',

    render: function () {
      ScreenView.prototype.render.apply(this);

      this.collection.each(function(song){
        this.renderSong(song);
      }, this);
    },

    renderSong: function (song) {
      view = new SongListItemView({ model: song});
      this.$el.find('ul').append(view.$el);
    }
});
