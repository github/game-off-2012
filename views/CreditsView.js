CreditsView = ScreenView.extend({
    template: _.template($('#credits-template').html()),

    className: 'credits',

    render: function () {
      ScreenView.prototype.render.apply(this);

      this.collection.each(function(song){
        this.renderSong(song);
      }, this);
    },

    renderSong: function (song) {
      this.$el.find('#song-credits').append(
      	_.template($('#song-credit-template').html(), song.toJSON())
      )
    }
});