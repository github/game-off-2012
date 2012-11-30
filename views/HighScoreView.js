HighScoreView = ScreenView.extend({
    template: _.template($('#highscore-template').html()),

    className: 'highscore',

    render: function () {
      ScreenView.prototype.render.apply(this);
      this.collection.each(function(song){
        this.renderSong(song);
      }, this);
    },

    renderSong: function (song) {
      this.$el.find('#scores').append(
      	'<li>' + song.get('name') + ' - ' + (localStorage[song.get('filename')] || 0) + '</li>'
      )
    }
});